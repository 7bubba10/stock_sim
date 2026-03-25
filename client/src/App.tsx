import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Trade } from './pages/Trade';
import { Home } from './pages/Home';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/trade' element={<Trade />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App