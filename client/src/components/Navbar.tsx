import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, NavLink } from "react-router-dom";

export const NavBar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <Link to="/dashboard" className="navbar-logo">
                <div className="navbar-logo-icon">📈</div>
                <span>StockSim</span>
            </Link>

            <div className="navbar-nav">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/trade"
                    className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                    Trade
                </NavLink>
            </div>

            <div className="navbar-actions">
                <button
                    className="btn btn-ghost"
                    onClick={() => { logout(); navigate('/login'); }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}