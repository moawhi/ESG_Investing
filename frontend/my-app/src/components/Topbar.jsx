import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

import Logo from './Logo';
import AccountMenu from './AccountMenu';

function Topbar() {

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#b5d8b1' }}>
        <Toolbar>
          <Logo></Logo>
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            sx={{ backgroundColor: '#fff', borderRadius: 1, mr: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <AccountMenu></AccountMenu>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Topbar;