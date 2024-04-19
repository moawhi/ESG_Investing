/* handles styling of topbar */

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Typography } from '@mui/material';

import Logo from './Logo';
import AccountMenu from './AccountMenu';

function Topbar() {
  // places logo, platform name and account icon in topbar
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#b5d8b1', maxHeight: '60px' }}>
        <Toolbar>
          <Logo />
          <Typography variant='h5' sx={{ ml: 1, color: '#779c73', fontWeight: 'bold' }}>HF ESG Management</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <AccountMenu />
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Topbar;