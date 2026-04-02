import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Transaction } from './pages/Transactions';
import { Watchlist } from './pages/Watchlist';
import { Backtest } from './pages/Backtest';
import { Dashboard } from './pages/Dashboard';
import { Register } from './pages/Register';
import { NavBar } from './components/Navbar';
import { Alerts } from './pages/Alerts';
import { Login } from './pages/Login';
import { Trade } from './pages/Trade';
import { Home } from './pages/Home';

const AppLayout = () => {
  const { token } = useAuth();

  return (
    <>
      {token && <NavBar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='/trade' element={<ProtectedRoute><Trade /></ProtectedRoute>} />
        <Route path='/transactions' element={<ProtectedRoute><Transaction /></ProtectedRoute>} />
        <Route path='/backtest' element={<ProtectedRoute><Backtest/></ProtectedRoute>} />
        <Route path='/watchlist' element={<ProtectedRoute><Watchlist/></ProtectedRoute>} />
        <Route path='/alerts' element={<ProtectedRoute><Alerts/></ProtectedRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App