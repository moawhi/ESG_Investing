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
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmpBQKAqzONFKoY_UAM9kFAfUllZl1yFkmtrAo00AWSuJZ9LHVIyQa4CNMxLZAo7z2VHk&usqp=CAU"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginRight: '10px',
          width: 'auto',
          height: '60px',
          mixBlendMode: 'color-burn',
        }}
      >
      </Box>
    </Button>
  )
}

export default Logo;
