import React from 'react';
import { Typography, Box, Avatar, Menu, MenuItem, ListItemIcon, IconButton, Divider, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PieChartOutlineIcon from '@mui/icons-material/PieChartOutline';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ListRounded from '@mui/icons-material/ListRounded';
import { useNavigate } from 'react-router-dom';

const AccountMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const first = localStorage.getItem('firstName');
  const last = localStorage.getItem('lastName');
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  };

  const handleLogout = async () => {
  const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:12345/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({token}),
      });
      if (response.ok) {
        localStorage.removeItem('token');
        navigate('/');
      } 
    } catch (error) {
      console.error('Error occurred', error);
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', margin: '4px' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            edge="end"
            color="inherit"
          >
            <Avatar sx={{ width: 38, height: 38 }}></Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          '& .MuiMenu-paper': {
            overflow: 'visible', 
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            }}
        }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> <Typography >{first} {last}</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleNavigate('/dashboard')}>
          <ListItemIcon>
            <HomeRoundedIcon />
          </ListItemIcon>
          <Typography > My Account</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleNavigate('/')}>
          <ListItemIcon>
            <ListRounded />
          </ListItemIcon>
          <Typography > Watchlist</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleNavigate('/')}>
          <ListItemIcon>
            <PieChartOutlineIcon />
          </ListItemIcon>
          <Typography > Portfolio</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleLogout()}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <Typography > Logout</Typography>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
export default AccountMenu;
