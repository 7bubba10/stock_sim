import axios from "axios";

// Returns daily OHLCV bars from Polygon. adjusted=true accounts for splits and dividends.
export const getHistoricalPrices = async (ticker:string, from:string, to:string) => {
    try {
        const response = await axios.get(`https://api.massive.com/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${process.env.POLYGON_API_KEY}`);
        const data = response.data;

        return data;

    } catch (error) {
        console.error(`Error fetching price for ${ticker}:`, error)
        throw error
    }
}