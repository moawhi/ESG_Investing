import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {Box, Typography, Grid } from '@mui/material';
import Topbar from './Topbar';
import CompanyDetails from './CompanyDetails';
import FrameworkSelection from './FrameworkSelection';
import MetricAccordion from './MetricAccordion';

const CompanyInfo = () => {
  const location = useLocation();

  const companyId = location.state;

  const [companyDetails, setCompanyDetails] = useState([]);
  const [frameworks, setFrameworks] = useState([]);
  const [metricDetails, setMetricDetails] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token'); 
  
    const fetchCompanyDetails = async () => {
      try {
        const response = await fetch(`http://localhost:12345/company/${companyId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorisation': 'Bearer ' + token,
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          setCompanyDetails(responseData); 
        } else {
          const errorBody = await response.json();
          console.error(errorBody.message);
        }

      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    };
    
    if (companyId) {
      fetchCompanyDetails();
    }
  }, [companyId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const fetchFrameworks = async () => {
      try {
        const response = await fetch(`http://localhost:12345/framework/list?company_id=${companyId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorisation': 'Bearer ' + token,
          },
        })
          if (response.ok) {
            const responseData = await response.json();
            setFrameworks(responseData.frameworks);
          } else {
            const errorBody = await response.json();
            console.error(errorBody.message);
          }
        } catch (error) {
          console.error('Error fetching frameworks', error);
        }
      }

    if (companyId) {
      fetchFrameworks(); 
    }
  }, [companyId]);


  const handleFrameworkSelection = async (frameworkId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:12345/company/esg?company_id=${companyId}&framework_id=${frameworkId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorisation': 'Bearer ' + token,
      },
    });
      if (response.ok) {
        const responseData = await response.json();
        setMetricDetails(responseData.esg_data);
      } else {
        const errorBody = await response.json();
        console.error(errorBody.message);
      }
    }
    catch (error) {
      console.error('Error fetching esg details:', error);
    }
  };
  
  return (
    <div>
      <Topbar />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%',
            }}>
            <CompanyDetails companyDetails={companyDetails} />
            <Box sx={{ 
              flex: 1
            }}> 
              <FrameworkSelection
              frameworks={frameworks}
              onSelectFramework={handleFrameworkSelection}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container sx={{ pt: 4, pl: 1, mb: 1, alignItems: 'center' }}>
            <Grid item xs={6.9}>
            <Typography sx={{ fontSize: '1.5rem', fontWeight:'bold' }}>Metrics and Indicators</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography sx={{ fontWeight: 'bold' }}>Weight</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography sx={{ fontWeight: 'bold' }}>2022</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography sx={{ fontWeight: 'bold' }}>2023</Typography>
            </Grid>
          </Grid>
          <Box sx={{ 
            maxHeight: '84vh', 
            overflow: 'auto',
            scrollbarWidth: 'none' 
            }}>
            <MetricAccordion metricDetails={metricDetails} />
          </Box>
        </Grid>
      </Grid>
    </div>
  )
}

export default CompanyInfo;