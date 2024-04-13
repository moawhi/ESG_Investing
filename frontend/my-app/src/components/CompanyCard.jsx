import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import DevicesIcon from '@mui/icons-material/Devices';
import FactoryIcon from '@mui/icons-material/Factory';

// Adjust the props to include investmentAmount and impactStatement as optional
const CompanyCard = ({ companyDetails, investmentAmount, impactStatement }) => {
  const navigate = useNavigate();

  const industryIcons = {
    Technology: DevicesIcon,
    Energy: EnergySavingsLeafIcon,
    Finance: AttachMoneyIcon,
    Manufacturing: FactoryIcon,
  };

  const handleSelectCompany = (company) => {
    navigate('/company_info', { state: company });
  }

  return (
    <div>
      <Card sx={{
        display: 'flex',
        flexDirection: 'row',
        overflow: 'auto',
        height: '230px',
        width: '100%',
        border: '2px solid #e0e0e0',
        borderRadius: '12px',
        ':hover': {
          bgcolor: 'action.hover',
          cursor: 'pointer'
        },
        transition: 'border-color 0.3s',
      }}
        onClick={() => handleSelectCompany(companyDetails.company_id)}>
        <Box sx={{
          flex: 1,
          padding: 2,
        }}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              {industryIcons[companyDetails.industry] ? React.createElement(industryIcons[companyDetails.industry], { sx: { verticalAlign: 'middle', mr: 2, color: '#779c73', fontSize: '4rem' } }) : null}
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>{companyDetails.name}</Typography>
              {companyDetails.company_name && (<Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>{companyDetails.company_name}</Typography>
              )}
              {investmentAmount && (
                <Typography sx={{ fontSize: '1rem', mt: 1, fontWeight: 'bold' }}> ${investmentAmount.toLocaleString()}</Typography>
              )}
              {impactStatement && (
                <Typography sx={{ fontSize: '1rem', mt: 1 }}>{impactStatement}</Typography>
              )}
            </Grid>
          </Grid>
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 2,
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="span" sx={{ fontWeight: 'bold' }}>
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
            <Typography variant="h4" component="span" sx={{ fontWeight: 'bold' }}>
              {companyDetails.industry_ranking}
            </Typography>
            <Typography variant="subtitle1" sx={{ display: 'block' }}>
              Industry Ranking
            </Typography>
          </Box>
        </Box>
      </Card>
    </div>
  );
};

export default CompanyCard;
