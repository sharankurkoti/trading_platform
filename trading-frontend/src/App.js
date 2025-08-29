// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Dashboard from './Dashboard';
import Navbar from './components/Navbar';
import LOCService from './LOCService';
import FinanceService from './FinanceService';
import TradeExchangeService from './TradeExchangeService';

function AppWrapper() {
  const location = useLocation();

  // Hide Navbar on these paths
  const hideNavbarPaths = ['/loc', '/finance', '/trade'];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/loc" element={<LOCService />} />
        <Route path="/finance" element={<FinanceService />} />
        <Route path="/trade" element={<TradeExchangeService />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;