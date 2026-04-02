# 📈 StockSim

A full-stack paper trading simulator with real market data, portfolio analytics, and a backtesting engine.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## Overview

StockSim lets you trade stocks with $100,000 in virtual cash using real-time market prices from Alpaca Markets. Track your portfolio performance against the S&P 500, backtest trading strategies on historical data, set price alerts, and build a watchlist — all without risking real money.

## About

I built StockSim as a personal project to sharpen my full-stack development skills while exploring a domain I'm genuinely interested in — finance and algorithmic trading. As a CS student at Marist University, I wanted to go beyond typical apps and build something with real data, real APIs, and interesting engineering problems. This is an ongoing project and I plan to keep expanding it with new features and strategies.

## Features

- **Paper Trading** — Buy and sell stocks at real market prices using virtual cash
- **Live Portfolio Dashboard** — See your positions, current values, and gain/loss in real time
- **Performance Chart** — Visualize your portfolio value over time vs the SPY benchmark
- **Backtesting Engine** — Test a moving average crossover strategy against historical price data
- **Transaction History** — Full log of every trade with price, shares, and timestamp
- **Watchlist** — Track stocks you're interested in with live prices
- **Price Alerts** — Set alerts for when a stock crosses a target price (above or below)
- **JWT Auth** — Secure register/login with protected routes

## Tech Stack

**Frontend**
- React + TypeScript (Vite)
- Recharts for data visualization
- React Router for navigation

**Backend**
- Node.js + Express + TypeScript
- PostgreSQL for data persistence
- JWT for authentication
- bcryptjs for password hashing

**APIs**
- [Alpaca Markets](https://alpaca.markets) — real-time stock prices and paper trading
- [Massive (Polygon.io)](https://massive.com) — historical OHLC price data for backtesting

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL

### Setup

1. Clone the repo
```bash
git clone https://github.com/7bubba10/stock_sim.git
cd stock_sim
```

2. Set up the server
```bash
cd server
npm install
```

3. Create a `.env` file in `/server`:
```
PORT=3001
DATABASE_URL=postgresql://localhost:5432/stocksim
JWT_SECRET=your_jwt_secret
ALPACA_API_KEY=your_alpaca_key
ALPACA_SECRET_KEY=your_alpaca_secret
ALPACA_BASE_URL=https://paper-api.alpaca.markets
POLYGON_API_KEY=your_polygon_key
```

4. Create the database and run the schema
```bash
psql postgres -c "CREATE DATABASE stocksim"
psql stocksim < src/db/schema.sql
```

5. Start the server
```bash
npm run dev
```

6. Set up the client
```bash
cd ../client
npm install
npm run dev
```

7. Open `http://localhost:5173` and register an account — you start with $100,000 in virtual cash.

## Backtesting

The backtesting engine implements a **moving average crossover strategy**:
- Buy signal: short-term MA crosses above long-term MA (golden cross)
- Sell signal: short-term MA crosses below long-term MA (death cross)

Configure the ticker, date range, window sizes, and starting cash to simulate how the strategy would have performed on historical data.

## Project Structure
```
stock-sim/
├── client/          # React + TypeScript frontend
│   └── src/
│       ├── pages/       # Dashboard, Trade, Backtest, etc.
│       ├── components/  # Navbar, ProtectedRoute
│       ├── context/     # AuthContext
│       └── services/    # API functions
└── server/          # Node + Express backend
    └── src/
        ├── controllers/ # Route handlers
        ├── routes/      # Express routers
        ├── middleware/  # JWT auth
        ├── services/    # Alpaca + Polygon API clients
        └── db/          # PostgreSQL connection + schema
```

## License

MIT