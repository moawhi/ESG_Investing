/* eslint-disable react/react-in-jsx-scope */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText, Divider, Stack, Grid } from '@mui/material';
import Topbar from './Topbar';
import { fetchCompanyDetails, fetchPortfolioData } from './helper';

import CompanyCard from './CompanyCard';

const Dashboard = () => {
  const navigate = useNavigate();

  const [industries, setIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [companyDetails, setCompanyDetails] = useState([]);

  const token = localStorage.getItem('token');
  const name = localStorage.getItem('firstName');

  // fetch industries and companies
  useEffect(() => {
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
    fetchIndustriesAndCompanies();
  }, [token]);

  const fetchDataDetails = async () => {
    const details = await fetchCompanyDetails(companies);
    setCompanyDetails(details);
  }

  useEffect(() => {
    fetchDataDetails();
  }, [companies]);

  // function to handle selecting industry
  const handleSelectIndustry = (industry) => {
    setSelectedIndustry(industry);
    // get companies based on selected industry
    const industryCompanies = industries.find(i => i.type === industry)?.companies || [];
    setCompanies(industryCompanies);
    fetchDataDetails();
  };

  const handleSelectCompany = (company) => {
    navigate('/company_info', { state: company });
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
              {/* <Typography variant="h5" gutterBottom>Get Started</Typography> */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              flex: '1',
              gap: 10,
            }}>
              <Box sx={{
                width: '22%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }} >
                <Typography variant="h6" sx={{ p: 1, fontWeight: '600' }}> Select an Industry </Typography>
                <Box sx={{
                  height: '90%',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  bgcolor: 'background.paper',
                }}>
                  <List>
                    {industries.map((industry) => (
                      <ListItem button key={industry.type} onClick={() => handleSelectIndustry(industry.type)} sx={{
                        ':hover': {
                          bgcolor: 'action.hover',
                          cursor: 'pointer'
                        },
                      }}>
                        <ListItemText primary={industry.type} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }} >
                <Stack>
                  <Typography variant="h6" sx={{ p: 1, fontWeight: '600' }}>Select a Company</Typography>
                </Stack>
                <Grid container spacing={2}>
                  {companyDetails && selectedIndustry && (
                    companyDetails.map((companyDetail) => (
                      <Grid item xs={12} md={4} key={companyDetail.company_id}>
                        <Box
                          sx={{
                            padding: 1,
                          }}
                          onClick={() => handleSelectCompany(companyDetail.company_id)}
                        >
                          <CompanyCard companyDetails={companyDetail} />
                        </Box>
                      </Grid>
                    ))
                  )}
                </Grid>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default Dashboard;