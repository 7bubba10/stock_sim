import pool from '../db'
import { getStockPrice } from './alpaca'

export const startAlertChecker = async () => {
    setInterval(async () => {
        try {
            const results = await pool.query(`select * from price_alerts where triggered = false`);

            for (const alert of results.rows) {
                const currentPrice = await getStockPrice(alert.ticker);

                const triggered =
                (alert.direction == 'above' && currentPrice >= alert.target_price) ||
                (alert.direction == 'below' && currentPrice <= alert.target_price);

                if (triggered) {
                    await pool.query(`update price_alerts set triggered = true where id = $1`,[alert.id]);
                    console.log(`Alert triggered: ${alert.ticker} hit ${currentPrice}`);
                }
            }

        } catch (error) {
            console.error('Alert checker error:', error);
        }
    },60000);
}