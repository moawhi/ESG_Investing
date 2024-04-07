import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import DevicesIcon from '@mui/icons-material/Devices';
import FactoryIcon from '@mui/icons-material/Factory';

const CompanyDetails = ({companyDetails}) => {

  const industryIcons = {
    Technology: DevicesIcon,
    Energy: EnergySavingsLeafIcon,
    Finance: AttachMoneyIcon,
    Manufacturing: FactoryIcon
  };

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
              { sx: { verticalAlign: 'middle', mr: 2, color: '#779c73', fontSize: '4rem' }}) : null}
          </Grid>
          <Grid item>
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{companyDetails.name}</Typography>
            <Typography>{companyDetails.industry}</Typography>
          </Grid>
          <Box sx={{ padding: 1, mt: 1 }}>
            <Typography>{companyDetails.info}</Typography>
          </Box>
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
    </div>
  )
}

export default CompanyDetails;