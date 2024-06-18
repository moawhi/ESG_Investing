/* handles logic and styling of company details component of company info page */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
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
        overflow: 'auto'
      }}>
        <Box sx={{
          flex: 1,
          padding: 4,
          mr: 2
        }}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              {industryIcons[companyDetails.industry] ? React.createElement(industryIcons[companyDetails.industry],
                { sx: { verticalAlign: 'middle', mr: 2, color: '#779c73', fontSize: '4rem' } }) : null}
            </Grid>
            <Grid item>
              <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{companyDetails.name}</Typography>
              <Typography>{companyDetails.industry}</Typography>
            </Grid>
            <Box sx={{ padding: 1, mt: 1 }}>
              <Typography>{companyDetails.info}</Typography>
            </Box>
            <InvestDialog companyDetail={companyDetails}></InvestDialog>
          </Grid>
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 2,
          mr: 6
        }}>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="h2" component="span" sx={{ fontWeight: 'bold' }}>
              {companyDetails.esg_rating}
            </Typography>
            <Typography variant="subtitle1" sx={{ display: 'block' }}>
              ESG Rating
            </Typography>
          </Box>
          <Box sx={{
            textAlign: 'center',
            mt: 2
          }}>
            <Typography variant="h2" component="span" sx={{ fontWeight: 'bold' }}>
              {companyDetails.industry_ranking}
            </Typography>
            <Typography variant="subtitle1" sx={{ display: 'block' }}>
              Industry Ranking
            </Typography>
          </Box>
        </Box>
      </Box>
    </div >
  )
}

export default CompanyDetails;