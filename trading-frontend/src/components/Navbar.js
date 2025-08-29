// src/components/Navbar.js
import React from 'react';
//import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/" className="nav-title">TradeX</a>
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
      </div>
    </nav>
  );
};

export default Navbar;