import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { runBacktest } from "../services/api";

export const Backtest = () => {
    const [ticker, setTicker] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [shortWindow, setShortWindow] = useState(0);
    const [longWindow, setLongWindow] = useState(0);
    const [startingCash, setStartingCash] = useState(0);
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setLoading(true);
        const res = await runBacktest(token, ticker, startDate, endDate, shortWindow, longWindow, startingCash);
        setResults(res);
        setLoading(false);
    };

    const totalReturn = results
        ? ((results.finalValue - results.startingCash) / results.startingCash) * 100
        : 0;
    const profitLoss = results ? results.finalValue - results.startingCash : 0;
    const isPositive = profitLoss >= 0;

    return (
        <div className="page" style={{ padding: '24px 0' }}>
            <div className="container">

                <div style={{ marginBottom: '28px' }}>
                    <h1 style={{ marginBottom: '4px' }}>Backtester</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                        Simulate a moving average crossover strategy on historical data
                    </p>
                </div>

                <div className="card" style={{ marginBottom: '28px' }}>
                    <div className="card-header">
                        <span className="card-title">Strategy Configuration</span>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                            <div className="field">
                                <label>Ticker</label>
                                <input placeholder="AAPL" value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())} />
                            </div>
                            <div className="field">
                                <label>Starting Cash</label>
                                <input type="number" placeholder="10000" value={startingCash || ''} onChange={e => setStartingCash(Number(e.target.value))} />
                            </div>
                            <div className="field">
                                <label>Start Date</label>
                                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                            </div>
                            <div className="field">
                                <label>End Date</label>
                                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                            </div>
                            <div className="field">
                                <label>Short Window (days)</label>
                                <input type="number" placeholder="5" value={shortWindow || ''} onChange={e => setShortWindow(Number(e.target.value))} />
                            </div>
                            <div className="field">
                                <label>Long Window (days)</label>
                                <input type="number" placeholder="20" value={longWindow || ''} onChange={e => setLongWindow(Number(e.target.value))} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                            {loading ? <><span className="spinner" />Running…</> : 'Run Backtest'}
                        </button>
                    </form>
                </div>

                {results && (
                    <div className="fade-in">
                        <div className="stat-grid" style={{ marginBottom: '28px' }}>
                            <div className="stat-card">
                                <div className="stat-label">Starting Cash</div>
                                <div className="stat-value">${results.startingCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Final Value</div>
                                <div className="stat-value">${results.finalValue.toFixed(2)}</div>
                                <div className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
                                    {isPositive ? '▲' : '▼'} ${Math.abs(profitLoss).toFixed(2)}
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Total Return</div>
                                <div className={`stat-value ${isPositive ? 'td-positive' : 'td-negative'}`}>
                                    {isPositive ? '+' : ''}{totalReturn.toFixed(2)}%
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Total Trades</div>
                                <div className="stat-value">{results.trades.length}</div>
                                <div className="stat-change" style={{ color: 'var(--text-muted)' }}>
                                    executions
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <span className="card-title">Trade Log</span>
                                <span className="badge badge-accent">{results.trades.length} trades</span>
                            </div>
                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Type</th>
                                            <th>Price</th>
                                            <th>Shares</th>
                                            <th>Cash After</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.trades.map((trade: any, i: number) => (
                                            <tr key={i}>
                                                <td>{new Date(trade.date).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={`badge ${trade.type === 'buy' ? 'badge-green' : 'badge-red'}`}>
                                                        {trade.type.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="td-mono">${trade.price.toFixed(2)}</td>
                                                <td className="td-mono">{trade.shares.toFixed(4)}</td>
                                                <td className="td-mono">${trade.cash.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
