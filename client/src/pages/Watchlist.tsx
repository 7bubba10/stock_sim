import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from "../services/api";

export const Watchlist = () => {
    const [ticker, setTicker] = useState('');
    const [watchList, setWatchlist] = useState<{ ticker: string, price: number }[]>([]);
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            setLoading(true);
            const results = await getWatchlist(token);
            setWatchlist(results);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !ticker.trim()) return;
        setError('');
        setAdding(true);
        try {
            await addToWatchlist(token, ticker.trim().toUpperCase());
            const update = await getWatchlist(token);
            setWatchlist(update);
            setTicker('');
        } catch {
            setError('Could not add ticker. Make sure it is a valid symbol.');
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (tickerToDelete: string) => {
        if (!token) return;
        await removeFromWatchlist(token, tickerToDelete);
        const update = await getWatchlist(token);
        setWatchlist(update);
    };

    return (
        <div className="page" style={{ padding: '24px 0' }}>
            <div className="container">

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                    <h1>Watchlist</h1>
                    <span className="badge badge-accent">{watchList.length} symbols</span>
                </div>

                {/* Add ticker form */}
                <div className="card" style={{ marginBottom: '24px' }}>
                    <div className="card-header">
                        <span className="card-title">Add Symbol</span>
                    </div>
                    <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                        <div className="field" style={{ flex: 1, marginBottom: 0 }}>
                            <label>Ticker Symbol</label>
                            <input
                                placeholder="e.g. AAPL"
                                value={ticker}
                                onChange={(e) => setTicker(e.target.value)}
                                style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={adding || !ticker.trim()}
                            style={{ flexShrink: 0 }}
                        >
                            {adding ? <span className="spinner" /> : '+ Add'}
                        </button>
                    </form>
                    {error && (
                        <div className="alert alert-error" style={{ marginTop: '14px' }}>
                            {error}
                        </div>
                    )}
                </div>

                {/* Watchlist table */}
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Tracked Symbols</span>
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                            <span className="spinner" style={{ width: 28, height: 28 }} />
                        </div>
                    ) : watchList.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '48px 0',
                            color: 'var(--text-muted)',
                            fontSize: '0.9rem',
                        }}>
                            No symbols yet. Add a ticker above to start watching.
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Symbol</th>
                                        <th>Price</th>
                                        <th style={{ width: 60 }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {watchList.map((item) => (
                                        <tr key={item.ticker}>
                                            <td>
                                                <span className="ticker-symbol">{item.ticker}</span>
                                            </td>
                                            <td>
                                                <span className="ticker-price td-mono">
                                                    ${item.price.toFixed(2)}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-ghost"
                                                    onClick={() => handleDelete(item.ticker)}
                                                    style={{
                                                        padding: '4px 10px',
                                                        fontSize: '0.8125rem',
                                                        color: 'var(--red)',
                                                        borderColor: 'transparent',
                                                    }}
                                                    title="Remove"
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
