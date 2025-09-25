import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/" className="nav-title">Digital Trading</a>
      </div>
      <div className="navbar-links">
        <button 
          onClick={() => window.open("/", "_self")} 
          className="nav-link"
        >
          Dashboard
        </button>

        <button
          onClick={() =>
            window.open(
              "/loc",
              "LOCWindow",
              "width=1000,height=800,toolbar=no,menubar=no,scrollbars=yes,resizable=yes"
            )
          }
          className="nav-link"
        >
          Letter Of Credit 
        </button>

        <button
          onClick={() =>
            window.open(
              "/finance",
              "FinanceWindow",
              "width=1000,height=800,toolbar=no,menubar=no,scrollbars=yes,resizable=yes"
            )
          }
          className="nav-link"
        >
          Trade Finance
        </button>

        <button
          onClick={() =>
            window.open(
              "/trade",
              "TradeWindow",
              "width=1000,height=800,toolbar=no,menubar=no,scrollbars=yes,resizable=yes"
            )
          }
          className="nav-link"
        >
          Trade Exchange
        </button>

        <button
          onClick={handleLogout}
          className="nav-link logout-button"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;