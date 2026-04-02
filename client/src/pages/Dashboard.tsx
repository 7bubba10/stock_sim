import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useState, useEffect } from "react";
import { getPerformance } from "../services/api";
import { useNavigate } from "react-router-dom";
import { getPortfolio } from "../services/api";
import { useAuth } from '../context/AuthContext';

interface Position {
    ticker: string
    shares: number
    avgCost: number
    currentPrice: number
    currentValue: number
    gainLoss: number
    gainLossPercent: number
}

export const Dashboard = () => {
    const [cashBalance, setCashBalance] = useState(0);
    const [performance, setPerformance] = useState<{ date: string, value: number, benchmarkValue: number | null }[]>([]);
    const [portfolio, setPortfolio] = useState<Position[]>([]);
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            const result = await getPortfolio(token);

            setPortfolio(result.portfolio);
            setCashBalance(parseFloat(result.cashBalance));
        }

        const fetchPerformance = async () => {
            if (!token) return;
            const result = await getPerformance(token);

            setPerformance(result);
        }

        fetchData();
        fetchPerformance();

    }, []);

    const loadTradePage = () => {
        navigate('/trade');
    }

    return (
        <div className="page" style={{ padding: '24px 0' }}>
            <div className="container">

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                    <h1>Portfolio</h1>
                    <button className="btn btn-primary" onClick={loadTradePage}>
                        Trade
                    </button>
                </div>

                <div className="stat-grid" style={{ marginBottom: '28px' }}>
                    <div className="stat-card">
                        <div className="stat-label">Cash Balance</div>
                        <div className="stat-value">${cashBalance.toFixed(2)}</div>
                    </div>
                </div>

                {performance.length > 1 ? (
                    <div className="card" style={{ marginBottom: '28px' }}>
                        <div className="card-header">
                            <span className="card-title">Portfolio Performance</span>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={performance}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                                <XAxis dataKey="date" stroke="#4a5a7a" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#4a5a7a" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                                <Tooltip
                                    formatter={(value: any, name: any) => [
                                        `$${Number(value).toFixed(2)}`,
                                        name === 'value' ? 'Portfolio' : 'SPY Benchmark'
                                    ]}
                                />
                                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="benchmarkValue" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="5 5" name="SPY Benchmark" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="card" style={{ marginBottom: '28px' }}>
                        <div className="card-header">
                            <span className="card-title">Portfolio Performance</span>
                        </div>
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                            Make more trades to see your performance chart.
                        </div>
                    </div>
                )}

                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Open Positions</span>
                    </div>

                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Shares</th>
                                    <th>Price</th>
                                    <th>Gain / Loss</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolio.map(position => (
                                    <tr key={position.ticker}>
                                        <td><span className="ticker-symbol">{position.ticker}</span></td>
                                        <td className="td-mono">{position.shares}</td>
                                        <td><span className="ticker-price">${position.currentPrice.toFixed(2)}</span></td>
                                        <td className={position.gainLoss >= 0 ? 'td-positive' : 'td-negative'}>
                                            {position.gainLoss >= 0 ? '+' : ''}${position.gainLoss.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
