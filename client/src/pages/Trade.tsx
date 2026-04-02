import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { buy,sell, getPrice } from "../services/api";


export const Trade = () => {
    const [ticker,setTicker] = useState('');
    const [price, setPrice] = useState(0);
    const [shares, setShares] = useState(0)
    const [loading, setLoading] = useState(false);
    const {token} = useAuth();
    


    const priceLookup = async () => {
        const newPrice = await getPrice(ticker);
        setPrice(newPrice);
    }

    const handleBuy = async () => {
        if (!token) return;
        setLoading(true);
        await buy(token!,ticker,shares);
        setLoading(false);
    }

    const handleSell = async() => {
        if (!token) return
        setLoading(true);
        await sell(token!,ticker,shares);
        setLoading(false);

    }



    return (
        <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
            <div className="trade-panel">
                <h2 style={{ marginBottom: 24, fontSize: '1.25rem' }}>Place a Trade</h2>

                <div className="field">
                    <label>Ticker Symbol</label>
                    <input
                        placeholder="e.g. AAPL"
                        style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}
                        onChange={(e) => setTicker(e.target.value)}
                    />
                </div>

                <div className="field" style={{ marginTop: 14 }}>
                    <label>Number of Shares</label>
                    <input
                        type="number"
                        placeholder="0"
                        min={1}
                        onChange={(e) => setShares(parseInt(e.target.value))}
                    />
                </div>

                <button
                    className="btn btn-secondary btn-full"
                    style={{ marginTop: 16 }}
                    onClick={priceLookup}
                >
                    Look Up Price
                </button>

                {price > 0 && (
                    <div style={{
                        marginTop: 16,
                        padding: '14px 16px',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <span className="stat-label" style={{ marginBottom: 0 }}>Current Price</span>
                        <span className="ticker-price" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                            ${price.toFixed(2)}
                        </span>
                    </div>
                )}

                <div className="divider" style={{ margin: '20px 0' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <button
                        className="btn btn-success"
                        onClick={handleBuy}
                        disabled={loading}
                    >
                        {loading ? <span className="spinner" /> : 'Buy'}
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={handleSell}
                        disabled={loading}
                    >
                        {loading ? <span className="spinner" /> : 'Sell'}
                    </button>
                </div>
            </div>
        </div>
    );
}
