import React from 'react';
import { UserProvider } from './UserContext';
import Topbar from '../Topbar/Topbar';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import ImgMediaCard from './ImgMediaCard';
import GeneralInformation from './GeneralInformation';

const Profile = () => {
  return (
    <UserProvider>
      <div>
        <Topbar />
        <Box component="main" sx={{ flexGrow: 1, py: 5, px: 3 }}>
          <Container>
            <Grid container spacing={{ xs: 3, lg: 4 }}>
              <Grid item xs={12} sx={{ py: 2 }}>
                <Stack direction="row" justifyContent="space-between" spacing={4}>
                  <Typography variant="h4">My Account</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <ImgMediaCard />
              </Grid>
              <Grid item xs={12} md={8}>
                <GeneralInformation />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </div>
    </UserProvider>
  );
};

export default Profile;
