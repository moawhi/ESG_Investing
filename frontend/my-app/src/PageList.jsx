import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import CompanyInfo from './components/CompanyInfo';
import Portfolio from './components/Portfolio/Portfolio';

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
  const [token, setToken] = React.useState(null);

  React.useEffect(() => {
    const checktoken = localStorage.getItem('token');
    if (checktoken) {
      setToken(checktoken);
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element= {<NoAuth><Login/></NoAuth> } />
        <Route path="/register" element= { <NoAuth><Register/></NoAuth> } />
        <Route path="/dashboard" element= {<RequireAuth><Dashboard/></RequireAuth>} />
        <Route path="/company_info" element={<RequireAuth><CompanyInfo/></RequireAuth>} />
        <Route path="/" element={<Login token={token} setToken={setToken} />} />
        <Route path="/register" element={<Register token={token} setToken={setToken} />} />
        <Route path="/dashboard" element={<Dashboard token={token} setToken={setToken} />} />
        <Route path="/profile" element={<RequireAuth><Profile token={token} setToken={setToken} /></RequireAuth>} />
        <Route path="/portfolio" element={<RequireAuth><Portfolio token={token} setToken={setToken} /></RequireAuth>} />
      </Routes>
    </>
  );
}

export default PageList;