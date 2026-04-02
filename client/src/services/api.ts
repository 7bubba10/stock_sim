import axios from "axios";

// If idle return to login page
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
    const response = await axios.post('https://stocksim-production-97c0.up.railway.app/api/auth/register', { email, username, password });
    const data = response.data;
    return data;
}

export const login = async (email: string, password: string) => {
    const response = await axios.post('https://stocksim-production-97c0.up.railway.app/api/auth/login', { email, password });
    const data = response.data;
    return data;
}

export const getPortfolio = async (token: string) => {
    const response = await axios.get('https://stocksim-production-97c0.up.railway.app/api/portfolio', {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}

export const getTransactions = async (token: string) => {
    const response = await axios.get('https://stocksim-production-97c0.up.railway.app/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}

export const getPerformance = async (token: string) => {
    const response = await axios.get('https://stocksim-production-97c0.up.railway.app/api/performance', {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}

export const buy = async (token: string, ticker: string, shares: number) => {
    const response = await axios.post('https://stocksim-production-97c0.up.railway.app/api/trades/buy', { ticker, shares }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}

export const sell = async (token: string, ticker: string, shares: number) => {
    const response = await axios.post('https://stocksim-production-97c0.up.railway.app/api/trades/sell', { ticker, shares }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;

}

export const runBacktest = async (token: string, ticker: string, startDate: string, endDate: string, shortWindow: number, longWindow: number, startingCash: number) => {
    const response = await axios.post('https://stocksim-production-97c0.up.railway.app/api/backtest', { ticker, startDate, endDate, shortWindow, longWindow, startingCash }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}

export const getPrice = async (ticker: string) => {
    const response = await axios.get(`https://stocksim-production-97c0.up.railway.app/api/market/price?ticker=${ticker}`);
    const data = response.data;
    return data;
}

export const addToWatchlist = async (token: string, ticker: string) => {
    const response = await axios.post('https://stocksim-production-97c0.up.railway.app/api/watchlist', { ticker }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}

export const removeFromWatchlist = async (token: string, ticker: string) => {
    const response = await axios.delete(`https://stocksim-production-97c0.up.railway.app/api/watchlist/${ticker}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}

export const getWatchlist = async (token: string) => {
    const response = await axios.get('https://stocksim-production-97c0.up.railway.app/api/watchlist', {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}

export const getAlerts = async (token: string) => {
    const response = await axios.get('https://stocksim-production-97c0.up.railway.app/api/alerts', {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}

export const createAlert = async (token: string, ticker: string, targetPrice: number, direction: string) => {
    const response = await axios.post(`https://stocksim-production-97c0.up.railway.app/api/alerts`, {ticker, targetPrice, direction},{
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}

export const deleteAlert = async (token: string, id: number) => {
    const response = await axios.delete(`https://stocksim-production-97c0.up.railway.app/api/alerts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}