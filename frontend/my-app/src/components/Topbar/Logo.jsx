/* handles logic and styling of logo */
/* eslint-disable react/react-in-jsx-scope */
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SpaIcon from '@mui/icons-material/Spa';

const Logo = () => {
  const navigate = useNavigate();

  // when logo is clicked navigate back to dashboard
  const handleLogoClick = () => {
    navigate('/');
  };

  // styling of logo
  return (
    <IconButton onClick={handleLogoClick} 
    sx={{ 
      m: 1, 
      color: '#b5d8b1', 
      backgroundColor: '#779c73', 
    '&:hover': {
      color: '#779c73',
      backgroundColor: "#b5d8b1",
    }}}>
        <SpaIcon />
    </IconButton>
  )
}

export default Logo;
