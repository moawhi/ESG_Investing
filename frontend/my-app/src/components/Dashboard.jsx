/* eslint-disable react/react-in-jsx-scope */

import React, { useState } from 'react';
import Topbar from './Topbar';
//import Sidebar from './Sidebar';
import { Box, Button, Typography, List, ListItem, ListItemText } from '@mui/material';
import FrameworkSelection from './FrameworkSelection';

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const name = localStorage.getItem('firstName');

  const industries = ['Technology', 'Finance', 'Healthcare', 'Lifestyle'];
  const companies = ['Company A', 'Company B', 'Company C'];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Topbar />
      <Box sx={{ display: 'flex', height: '90vh', ml: 3, mr: 3 }}>
        <Box sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          }}>
          <Box sx={{ 
            padding: 2, 
            fontSize: '1rem', 
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            }}>
            <Box>
              <Typography variant="h4" sx={{ mb: 1, mt: 1 }}>Welcome, {name}.</Typography>
              <Typography variant="h5" gutterBottom>Get Started</Typography>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              flex: '1',
              gap: 10,
            }}>
              <Box sx={{
                width: '25%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }} >
                <Typography sx={{ p: 2 }}> Select an Industry </Typography>
                <Box sx={{
                  height: '90%',
                  bgcolor: 'background.paper',
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  border: '2px solid #000',
                }}>
                  <List>
                    {industries.map((industry) => (
                      <ListItem button key={industry} onClick={() => console.log(industry)}>
                        <ListItemText primary={industry} />
                      </ListItem>
                    ))}
                  </List>
                  </Box>
                </Box>
              <Box sx={{
                width: '25%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }} >
                <Typography sx={{ p: 2 }}>Select a Company</Typography>
                <Box sx={{
                  height: '90%',
                  bgcolor: 'background.paper',
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  border: '2px solid #000',
                }}>
                  <List>
                    {companies.map((company) => (
                      <ListItem button key={company} onClick={() => console.log(company)}>
                        <ListItemText primary={company} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            </Box>
            <Box>
              <Button variant="contained" onClick={handleOpen}>Select Framework</Button>
              <FrameworkSelection open={open} onClose={handleClose} />
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default Dashboard;