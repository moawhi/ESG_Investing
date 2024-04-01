import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

const RequireAuth = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const NoAuth = ({ children }) => {
  return !isAuthenticated() ? children : <Navigate to="/dashboard" replace />;
};

const PageList = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element= {<NoAuth><Login/></NoAuth> } />
        <Route path="/register" element= { <NoAuth><Register/></NoAuth> } />
        <Route path="/dashboard" element= {<RequireAuth><Dashboard/></RequireAuth>} />
      </Routes>
    </>
  );
}

export default PageList;