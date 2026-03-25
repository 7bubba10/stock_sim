import axios from "axios";

export const register = async (email: string, username: string, password: string) => {
    const response = await axios.post('http://localhost:3001/api/auth/register', { email, username, password });
    const data = response.data;
    return data;
}

export const login = async (email: string, password: string) => {
    const response = await axios.post('http://localhost:3001/api/auth/login', { email, password });
    const data = response.data;
    return data;
}

export const getPortfolio = async (token: string) => {
    const response = await axios.get('http://localhost:3001/api/portfolio', {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}

export const buy = async (token: string,ticker: string, shares: number) => {
    const response = await axios.post('http://localhost:3001/api/trades/buy',{ticker,shares} , {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;
}

export const sell = async (token: string,ticker: string, shares: number) => {
    const response = await axios.post('http://localhost:3001/api/trades/sell',{ticker,shares} , {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;
    return data;

}