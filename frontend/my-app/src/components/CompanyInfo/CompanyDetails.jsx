/* handles logic and styling of company details component of company info page */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material'; // Added Paper for cards
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import DevicesIcon from '@mui/icons-material/Devices';
import FactoryIcon from '@mui/icons-material/Factory';
import InvestDialog from './InvestDialog';

const CompanyDetails = ({ companyId }) => {
  const [companyDetails, setCompanyDetails] = useState([]);

  // assign icons with industry
  const industryIcons = {
    Technology: DevicesIcon,
    Energy: EnergySavingsLeafIcon,
    Finance: AttachMoneyIcon,
    Manufacturing: FactoryIcon
  };

  // when companyId changes, fetch new company's details.
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

  // styling of company details component. 
  return (
    <div>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        // overflow: 'auto' // Keep if needed, but might not be with flex
      }}>
        {/* Main content area */}
        <Box sx={{
          flex: 3, // Give more space to main content
          padding: 3, // Adjusted padding
        }}>
          <Grid container spacing={2}> {/* Increased spacing for clarity */}
            <Grid item xs={12} container alignItems="center" spacing={2}> {/* Top row for icon, name, industry */}
              <Grid item>
                {industryIcons[companyDetails.industry] ? React.createElement(industryIcons[companyDetails.industry],
                  { sx: { verticalAlign: 'middle', color: '#28a745', fontSize: '4rem' } }) : null}
              </Grid>
              <Grid item xs>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#212529' }}>{companyDetails.name}</Typography>
                <Typography variant="subtitle1" sx={{ color: '#6C757D' }}>{companyDetails.industry}</Typography>
              </Grid>
            </Grid>
            <Grid item xs={12}> {/* Description below name/industry */}
              <Typography variant="body1" sx={{ color: '#212529', mt: 2 }}>{companyDetails.info}</Typography>
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}> {/* InvestDialog with some top margin */}
              <InvestDialog companyDetail={companyDetails}></InvestDialog>
            </Grid>
          </Grid>
        </Box>

        {/* ESG Rating and Ranking Cards Area */}
        <Box sx={{
          flex: 1, // Give less space compared to main content
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch', // Stretch items to fill width
          padding: 3, // Adjusted padding (was mt:2, mr:6)
          gap: 2, // Gap between the two Paper components
        }}>
          <Paper sx={{
            padding: 2,
            borderRadius: '8px',
            boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
            textAlign: 'center',
            bgcolor: '#FFFFFF'
          }}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#212529' }}>
              {companyDetails.esg_rating}
            </Typography>
            <Typography variant="subtitle1" sx={{ display: 'block', color: '#6C757D' }}>
              ESG Rating
            </Typography>
          </Paper>
          <Paper sx={{
            padding: 2,
            borderRadius: '8px',
            boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
            textAlign: 'center',
            bgcolor: '#FFFFFF'
          }}>
            <Typography variant="h4" component="span" sx={{ fontWeight: 'bold', color: '#212529' }}>
              {companyDetails.industry_ranking}
            </Typography>
            <Typography variant="subtitle1" sx={{ display: 'block', color: '#6C757D' }}>
              Industry Ranking
            </Typography>
          </Paper>
        </Box>
      </Box>
    </div >
  )
}

export default CompanyDetails;