// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Login from './components/Login';
import Dashboard from './Dashboard';
import Navbar from './components/Navbar';
import LOCService from './LOCService';
import FinanceService from './FinanceService';
import TradeExchangeService from './TradeExchangeService';
import PrivateRoute from './components/PrivateRoute';

// Internal component to handle routing and layout
function AppContent() {
  const location = useLocation();
  const hideNavbarPaths = ['/login'];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/loc" element={<LOCService />} />
          <Route path="/finance" element={<FinanceService />} />
          <Route path="/trade" element={<TradeExchangeService />} />
        </Route>

        {/* Fallback for undefined routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;