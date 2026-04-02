import React, { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import { getAlerts, createAlert, deleteAlert } from "../services/api";

export const Alerts = () => {
    const { token } = useAuth();
    const [alerts, setAlerts] = useState<{ id: number, ticker: string, target_price: number, direction: string, triggered: boolean }[]>([]);
    const [ticker, setTicker] = useState('');
    const [targetPrice, setTargetPrice] = useState('');
    const [direction, setDirection] = useState('above');
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            setLoading(true);
            const results = await getAlerts(token);
            setAlerts(results);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !ticker.trim() || !targetPrice) return;
        setError('');
        setAdding(true);
        try {
            await createAlert(token, ticker.trim().toUpperCase(), parseFloat(targetPrice), direction);
            const update = await getAlerts(token);
            setAlerts(update);
            setTicker('');
            setTargetPrice('');
            setDirection('above');
        } catch {
            setError('Could not create alert. Make sure the ticker is valid.');
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (idDelete: number) => {
        if (!token) return;
        await deleteAlert(token, idDelete);
        const update = await getAlerts(token);
        setAlerts(update);
    };

    const activeCount = alerts.filter(a => !a.triggered).length;

    return (
        <div className="page" style={{ padding: '24px 0' }}>
            <div className="container">

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                    <h1>Price Alerts</h1>
                    <span className="badge badge-accent">{activeCount} active</span>
                </div>

                {/* Create alert form */}
                <div className="card" style={{ marginBottom: '24px' }}>
                    <div className="card-header">
                        <span className="card-title">New Alert</span>
                    </div>
                    <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        <div className="field" style={{ flex: '1 1 120px', marginBottom: 0, minWidth: 100 }}>
                            <label>Ticker Symbol</label>
                            <input
                                placeholder="e.g. AAPL"
                                value={ticker}
                                onChange={(e) => setTicker(e.target.value)}
                                style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}
                            />
                        </div>
                        <div className="field" style={{ flex: '1 1 160px', marginBottom: 0, minWidth: 130 }}>
                            <label>Target Price</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                value={targetPrice}
                                onChange={(e) => setTargetPrice(e.target.value)}
                            />
                        </div>
                        <div className="field" style={{ flex: '1 1 140px', marginBottom: 0, minWidth: 120 }}>
                            <label>Direction</label>
                            <select
                                value={direction}
                                onChange={(e) => setDirection(e.target.value)}
                            >
                                <option value="above">Above</option>
                                <option value="below">Below</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={adding || !ticker.trim() || !targetPrice}
                            style={{ flexShrink: 0 }}
                        >
                            {adding ? <span className="spinner" /> : '+ Add Alert'}
                        </button>
                    </form>
                    {error && (
                        <div className="alert alert-error" style={{ marginTop: '14px' }}>
                            {error}
                        </div>
                    )}
                </div>

                {/* Alerts table */}
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Your Alerts</span>
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                            <span className="spinner" style={{ width: 28, height: 28 }} />
                        </div>
                    ) : alerts.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '48px 0',
                            color: 'var(--text-muted)',
                            fontSize: '0.9rem',
                        }}>
                            No alerts yet. Create one above to get notified when a price is hit.
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Symbol</th>
                                        <th>Target Price</th>
                                        <th>Direction</th>
                                        <th>Status</th>
                                        <th style={{ width: 60 }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alerts.map((alert) => (
                                        <tr key={alert.id}>
                                            <td>
                                                <span className="ticker-symbol">{alert.ticker}</span>
                                            </td>
                                            <td>
                                                <span className="td-mono">${Number(alert.target_price).toFixed(2)}</span>
                                            </td>
                                            <td>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    fontSize: '0.875rem',
                                                    color: alert.direction === 'above' ? 'var(--green)' : 'var(--red)',
                                                    fontWeight: 500,
                                                }}>
                                                    {alert.direction === 'above' ? '↑' : '↓'}
                                                    {alert.direction.charAt(0).toUpperCase() + alert.direction.slice(1)}
                                                </span>
                                            </td>
                                            <td>
                                                {alert.triggered ? (
                                                    <span className="badge badge-green">Triggered</span>
                                                ) : (
                                                    <span className="badge badge-accent">Active</span>
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-ghost"
                                                    onClick={() => handleDelete(alert.id)}
                                                    style={{
                                                        padding: '4px 10px',
                                                        fontSize: '0.8125rem',
                                                        color: 'var(--red)',
                                                        borderColor: 'transparent',
                                                    }}
                                                    title="Delete"
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
