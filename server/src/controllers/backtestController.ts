import { Request, Response } from "express";
import { getHistoricalPrices } from "../services/polygon";

// Simple moving average: average of the `window` prices ending at (but not including) `index`
export const calculateMA = (prices: number[], index: number, window: number) => {
    let slicedPirces = prices.slice((index - window), index).reduce((sum, price) => sum + price, 0);
    return slicedPirces / window;
}

export const runBackTest = async (req: Request, res: Response) => {
    try {
        const { ticker, startDate, endDate, shortWindow, longWindow, startingCash } = req.body;

        const historicalPrices = await getHistoricalPrices(ticker, startDate, endDate);

        const prices = historicalPrices.results.map((bar: any) => bar.c);

        // Moving average crossover strategy: all-in buy on golden cross, all-out sell on death cross
        let cash = startingCash;
        let shares = 0;
        const trades: any[] = [];

        // Start at longWindow so both MAs have enough history to be valid
        for (let i = longWindow; i < prices.length; i++) {
            const shortMA = calculateMA(prices, i, shortWindow);
            const longMA = calculateMA(prices, i, longWindow)
            const prevShortMA = calculateMA(prices, i - 1, shortWindow)
            const prevLongMA = calculateMA(prices, i - 1, longWindow);

            // buy signal: short MA crosses above long MA
            if (shortMA > longMA && prevShortMA < prevLongMA) {
                let price = prices[i];
                shares = cash / price;
                cash = 0;
                trades.push({ date: historicalPrices.results[i].t, type: 'buy', price, shares, cash });
            }
            // sell signal: short MA crosses below long MA
            if (longMA > shortMA && prevLongMA < prevShortMA) {
                let price = prices[i];
                cash += shares * price;
                shares = 0;
                trades.push({ date: historicalPrices.results[i].t, type: 'sell', price, shares, cash });
            }

        }

        // Mark any open position to market using the last available price
        const finalValue = cash + shares * prices[prices.length - 1]
        res.json({ trades, finalValue, startingCash })

    } catch (error) {
        console.error('Error :', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}