import axios from "axios";

export const getStockPrice = async (ticker: string) => {
    try {
        const response = await axios.get(`https://data.alpaca.markets/v2/stocks/${ticker}/trades/latest`, {
            headers: {
                'APCA-API-KEY-ID': process.env.ALPACA_API_KEY,
                'APCA-API-SECRET-KEY': process.env.ALPACA_SECRET_KEY
            }
        });

        const data = response.data;

        return data.trade.p;

    } catch (error) {
        console.error(`Error fetching price for ${ticker}:`, error)
        throw error
    }




}