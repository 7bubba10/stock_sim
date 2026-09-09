import axios from "axios";

// Base URL for the backend API. Defaults to the deployed production server so
// existing builds keep working, but can be overridden for local development via
// a Vite env var (e.g. VITE_API_URL=http://localhost:3001 in client/.env.local).
const API_URL = import.meta.env.VITE_API_URL ?? 'https://stocksim-production-97c0.up.railway.app';

// On any 401 response, clear the stored token and force a redirect to login
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
)

export const register = async (email: string, username: string, password: string) => {
    const response = await axios.post(`${API_URL}/api/auth/register`, { email, username, password });
    const data = response.data;
    return data;
}

export const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    const data = response.data;
    return data;
}

export const getPortfolio = async (token: string) => {
    const response = await axios.get(`${API_URL}/api/portfolio`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}

export const getTransactions = async (token: string) => {
    const response = await axios.get(`${API_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}

export const getPerformance = async (token: string) => {
    const response = await axios.get(`${API_URL}/api/performance`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}

export const buy = async (token: string, ticker: string, shares: number) => {
    const response = await axios.post(`${API_URL}/api/trades/buy`, { ticker, shares }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}

export const sell = async (token: string, ticker: string, shares: number) => {
    const response = await axios.post(`${API_URL}/api/trades/sell`, { ticker, shares }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;

}

export const runBacktest = async (token: string, ticker: string, startDate: string, endDate: string, shortWindow: number, longWindow: number, startingCash: number) => {
    const response = await axios.post(`${API_URL}/api/backtest`, { ticker, startDate, endDate, shortWindow, longWindow, startingCash }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}

export const getPrice = async (ticker: string) => {
    const response = await axios.get(`${API_URL}/api/market/price?ticker=${ticker}`);
    const data = response.data;
    return data;
}

export const addToWatchlist = async (token: string, ticker: string) => {
    const response = await axios.post(`${API_URL}/api/watchlist`, { ticker }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}

export const removeFromWatchlist = async (token: string, ticker: string) => {
    const response = await axios.delete(`${API_URL}/api/watchlist/${ticker}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}

export const getWatchlist = async (token: string) => {
    const response = await axios.get(`${API_URL}/api/watchlist`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}

export const getAlerts = async (token: string) => {
    const response = await axios.get(`${API_URL}/api/alerts`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}

export const createAlert = async (token: string, ticker: string, targetPrice: number, direction: string) => {
    const response = await axios.post(`${API_URL}/api/alerts`, {ticker, targetPrice, direction},{
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}

export const deleteAlert = async (token: string, id: number) => {
    const response = await axios.delete(`${API_URL}/api/alerts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}
