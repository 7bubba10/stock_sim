import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, NavLink } from "react-router-dom";

const NAV_ITEMS = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/trade", label: "Trade" },
    { to: "/transactions", label: "History" },
    { to: "/backtest", label: "Backtest" },
    { to: "/watchlist", label: "Watchlist" },
    { to: "/alerts", label: "Alerts" },
];

export const NavBar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar">
            <Link to="/dashboard" className="navbar-logo" onClick={closeMenu}>
                <div className="navbar-logo-icon">📈</div>
                <span>StockSim</span>
            </Link>

            <button
                className={`navbar-toggle${menuOpen ? ' open' : ''}`}
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
            >
                <span />
                <span />
                <span />
            </button>

            <div className={`navbar-menu${menuOpen ? ' open' : ''}`}>
                <div className="navbar-nav">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={closeMenu}
                            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                <div className="navbar-actions">
                    <button
                        className="btn btn-ghost"
                        onClick={() => { closeMenu(); logout(); navigate('/login'); }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
