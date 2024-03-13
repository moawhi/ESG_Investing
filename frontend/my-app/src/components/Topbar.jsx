import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

function Topbar() {
  const handleProfileClick = () => {
    console.log("Clicked profile icon");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation = {0} sx = {{ backgroundColor: '#1976D2' }}>
        <Toolbar>
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
          <IconButton
            size="small"
            edge="end"
            color="inherit"
            onClick={handleProfileClick}
          >
            <AccountCircle style={{ fontSize: '40px' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Topbar;