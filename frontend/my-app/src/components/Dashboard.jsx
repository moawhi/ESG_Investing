/* eslint-disable react/react-in-jsx-scope */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import Topbar from './Topbar';

const Dashboard = () => {
  const navigate = useNavigate();

  const [industries, setIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [companies, setCompanies] = useState([]);

  const token = localStorage.getItem('token');
  const name = localStorage.getItem('firstName');

  // fetch industries and companies
  const fetchIndustriesAndCompanies = async () => {
    try {
      const response = await fetch('http://localhost:12345/company/industry-company-list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorisation': 'Bearer ' + token,
        },
      })
      if (response.ok) {
        const responseData = await response.json();
        setIndustries(responseData.industries);
      } else {
        const errorBody = await response.json();
        console.error(errorBody.message);
      }
    } catch (error) {
      console.error('Error fetching industries and companies', error);
    }
  };

  useEffect(() => {
    fetchIndustriesAndCompanies();
  }, []);

  // function to handle selecting industry
  const handleSelectIndustry = (industry) => {
    setSelectedIndustry(industry);
    // get companies based on selected industry
    const industryCompanies = industries.find(i => i.type === industry)?.companies || [];
    setCompanies(industryCompanies);
  };

  const handleSelectCompany = (company) => {
    navigate('/company_info', { state: { company }});
  }

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
                    <ListItem button key={industry.type} onClick={() => handleSelectIndustry(industry.type)}>
                      <ListItemText primary={industry.type} />
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
                    {selectedIndustry && companies.map((company) => (
                      <ListItem button key={company.company_id} onClick={() => handleSelectCompany(company)}>
                        <ListItemText primary={company.name} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default Dashboard;