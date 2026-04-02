import { Link } from 'react-router-dom';

export const Home = () => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99, 102, 241, 0.12) 0%, transparent 70%), var(--bg-base)',
            padding: '24px',
            textAlign: 'center'
        }}>
            <div style={{ marginBottom: '24px' }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'var(--accent)',
                    borderRadius: '16px',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '32px',
                    margin: '0 auto 20px',
                    boxShadow: 'var(--shadow-accent)'
                }}>📈</div>
                <h1 style={{ fontSize: '3rem', marginBottom: '12px', letterSpacing: '-0.04em' }}>StockSim</h1>
                <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 40px' }}>
                    Trade stocks with $100,000 in virtual cash. Real market data, zero risk. Track your portfolio, backtest strategies, and see if you can beat the market.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/register">
                    <button className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '1rem' }}>
                        Get Started
                    </button>
                </Link>
                <Link to="/login">
                    <button className="btn btn-secondary" style={{ padding: '12px 32px', fontSize: '1rem' }}>
                        Sign In
                    </button>
                </Link>
            </div>

            <div className="stat-grid" style={{ marginTop: '80px', maxWidth: '800px', width: '100%' }}>
                <div className="stat-card" style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
                    <div className="card-title" style={{ marginBottom: '6px' }}>Live Market Data</div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Real prices from Alpaca Markets. Buy and sell at actual market rates.</p>
                </div>
                <div className="stat-card" style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
                    <div className="card-title" style={{ marginBottom: '6px' }}>Backtesting Engine</div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Test moving average strategies against years of historical data.</p>
                </div>
                <div className="stat-card" style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>📈</div>
                    <div className="card-title" style={{ marginBottom: '6px' }}>Beat the Market</div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Compare your performance against the S&P 500 benchmark.</p>
                </div>
            </div>
        </div>
    );
}