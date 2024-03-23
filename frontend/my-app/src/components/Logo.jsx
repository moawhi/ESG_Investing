/* eslint-disable react/react-in-jsx-scope */
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Logo = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };
  return (
    <Button onClick={handleLogoClick}>
      <Box
        component='img'
        alt='esg-logo'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginRight: '10px',
          width: '50px',
          height: '50px',
        }}
      >
      </Box>
    </Button>
  )
}

export default Logo;