import { useState, useEffect } from "react";
import { getTransactions } from "../services/api";
import { useAuth } from '../context/AuthContext';

interface Transaction {
    id: number
    ticker: string
    type: string
    shares: number
    price: number
    total: number
    created_at: string
}

export const Transaction = () => {
    const [transaction, setTransaction] = useState<Transaction[]>([]);
    const { token } = useAuth();

    useEffect(() => {
        const fetchTransaction = async () => {
            if (!token) return

            const result = await getTransactions(token);
            setTransaction(result);
        }

        fetchTransaction();
    }, []);

    return (
        <div className="page" style={{ padding: '24px 0' }}>
            <div className="container">
                <h1 style={{ marginBottom: '28px' }}>Transaction History</h1>
                <div className="card">
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Type</th>
                                    <th>Shares</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transaction.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                            No transactions yet.
                                        </td>
                                    </tr>
                                )}
                                {transaction.map(t => (
                                    <tr key={t.id}>
                                        <td><span className="ticker-symbol">{t.ticker}</span></td>
                                        <td><span className={`badge ${t.type === 'buy' ? 'badge-green' : 'badge-red'}`}>{t.type.toUpperCase()}</span></td>
                                        <td className="td-mono">{t.shares}</td>
                                        <td className="td-mono">${Number(t.price).toFixed(2)}</td>
                                        <td className="td-mono">${Number(t.total).toFixed(2)}</td>
                                        <td>{new Date(t.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )



}