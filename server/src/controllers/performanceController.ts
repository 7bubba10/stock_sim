import { Request, Response } from 'express';
import pool from '../db';
import { getHistoricalPrices } from '../services/polygon';

export const getPerformance = async (req: Request, res: Response) => {
    try {
        const userID = req.user?.id;

        const results = await pool.query(`select * from transactions where user_id = $1 order by created_at asc`, [userID]);

        const tickers = [...new Set(results.rows.map((t: any) => t.ticker))];

        const firstTxDate = new Date(results.rows[0].created_at);
        firstTxDate.setDate(firstTxDate.getDate() - 7);
        const fromDate = firstTxDate.toISOString().split('T')[0];
        const toDate = new Date().toISOString().split('T')[0];

        const historicalPrices = await Promise.all(
            tickers.map(ticker => getHistoricalPrices(ticker, fromDate, toDate))
        );

        // Fetch SPY benchmark data for the same date range
        const spyData = await getHistoricalPrices('SPY', fromDate, toDate);
        const spyPriceMap: Record<string, number> = {};
        const spyBars = spyData?.results || [];
        spyBars.forEach((bar: any) => {
            const date = new Date(bar.t).toISOString().split('T')[0];
            spyPriceMap[date] = bar.c;
        })

        // Calculate how many SPY shares $100,000 would have bought on day 1
        const firstSpyPrice = spyBars[0]?.c || 1;
        const spyShares = 100000 / firstSpyPrice;

        // Build a map of ticker -> array of { date, close }
        const priceMap: Record<string, Record<string, number>> = {};
        tickers.forEach((ticker, i) => {
            priceMap[ticker as string] = {};
            const bars = historicalPrices[i]?.results || [];
            bars.forEach((bar: any) => {
                const date = new Date(bar.t).toISOString().split('T')[0];
                priceMap[ticker as string][date] = bar.c;
            });
        });

        // Replay transactions day by day
        let cash = 100000;
        const positions: Record<string, number> = {};
        const performanceData: { date: string, value: number, benchmarkValue: number | null }[] = [];

        const allDates = [...new Set(
            Object.values(priceMap).flatMap(dateMap => Object.keys(dateMap))
        )].sort();

        for (const date of allDates) {
            // Apply transactions for this date
            for (const tx of results.rows) {
                const txDate = new Date(tx.created_at).toISOString().split('T')[0];
                if (txDate === date) {
                    if (tx.type === 'buy') {
                        cash -= parseFloat(tx.total);
                        positions[tx.ticker] = (positions[tx.ticker] || 0) + parseFloat(tx.shares);
                    } else {
                        cash += parseFloat(tx.total);
                        positions[tx.ticker] = (positions[tx.ticker] || 0) - parseFloat(tx.shares);
                    }
                }
            }

            // Calculate portfolio value for this date
            let stockValue = 0;
            for (const [ticker, shares] of Object.entries(positions)) {
                const price = priceMap[ticker]?.[date];
                if (price) stockValue += shares * price;
            }

            const spyPrice = spyPriceMap[date];
            const spyValue = spyPrice ? spyShares * spyPrice : null;

            performanceData.push({ date, value: cash + stockValue, benchmarkValue: spyValue });
        }

        res.json(performanceData)

    } catch (error) {
        console.error('Error', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}