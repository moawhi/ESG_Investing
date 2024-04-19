import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/AccountManagement/Login';
import Register from './components/AccountManagement/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Profile/Profile';
import CompanyInfo from './components/CompanyInfo/CompanyInfo';
import Portfolio from './components/Portfolio/Portfolio';

const PageList = () => {
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
  
  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element= {<NoAuth><Login/></NoAuth> } />
        <Route path="/register" element= { <NoAuth><Register/></NoAuth> } />
        <Route path="/dashboard" element= {<RequireAuth><Dashboard/></RequireAuth>} />
        <Route path="/company_info" element={<RequireAuth><CompanyInfo/></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile/></RequireAuth> } />
        <Route path="/portfolio" element={<RequireAuth><Portfolio/></RequireAuth> } />
      </Routes>
    </>
  );
}

export default PageList;