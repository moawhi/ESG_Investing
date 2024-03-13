/* eslint-disable react/react-in-jsx-scope */

import React from 'react';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import Box from '@mui/material/Box';

const Dashboard = () => {
  return (
    <div>
      <Topbar />
      <Box sx={{ display: 'flex', height: '90vh' }}>
        <Box sx={{ width: '250px', bgcolor: 'background.paper' }}>
          <Sidebar/>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ padding: 2, fontSize: '2rem' }}>
            Dashboard
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default Dashboard;