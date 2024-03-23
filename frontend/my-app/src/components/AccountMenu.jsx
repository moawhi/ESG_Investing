import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import LogoutIcon from '@mui/icons-material/Logout';
import PieChartOutlineIcon from '@mui/icons-material/PieChartOutline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ListRounded from '@mui/icons-material/ListRounded';
import { useNavigate } from 'react-router-dom';

const AccountMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const owner = localStorage.getItem('owner');
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
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> <Typography sx={{ fontFamily: 'Montserrat' }}>{owner}</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleNavigate('/dashboard')}>
          <ListItemIcon>
            <HomeRoundedIcon fontSize="small" />
          </ListItemIcon>
          <Typography sx={{ fontFamily: 'Montserrat' }}> My Account</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleNavigate('/')}>
          <ListItemIcon>
            <ListRounded fontSize="small" />
          </ListItemIcon>
          <Typography sx={{ fontFamily: 'Montserrat' }}> Watchlist</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleNavigate('/')}>
          <ListItemIcon>
            <PieChartOutlineIcon fontSize="small" />
          </ListItemIcon>
          <Typography sx={{ fontFamily: 'Montserrat' }}> Potfolio</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleNavigate('/')}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <Typography sx={{ fontFamily: 'Montserrat' }}> Logout</Typography>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
export default AccountMenu;
