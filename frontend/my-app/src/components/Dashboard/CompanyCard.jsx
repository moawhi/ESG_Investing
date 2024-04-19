import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import DevicesIcon from '@mui/icons-material/Devices';
import FactoryIcon from '@mui/icons-material/Factory';

/**
 * 
 * @param {companyDetails, investAmount, impactStatement, select, onSelect}
 * @returns Company Card showing details about a company or invested amount in this company when
 * using in portfolio page
 */
const CompanyCard = ({
  companyDetails,
  investmentAmount,
  impactStatement,
  selected = false,
  onSelect,
}) => {
  const navigate = useNavigate();

  const industryIcons = {
    Technology: DevicesIcon,
    Energy: EnergySavingsLeafIcon,
    Finance: AttachMoneyIcon,
    Manufacturing: FactoryIcon,
  };

  // Disable navigate to company Info page when it's in edit mode in Portfolio page
  const handleClick = () => {
    if (onSelect) {
      onSelect(companyDetails.company_id);
    } else {
      navigate('/company_info', { state: companyDetails.company_id });
    }
  };

  return (
    <div>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          height: '200px',
          width: '100%',
          border: selected ? '3px solid #779c73' : '2px solid #e0e0e0',
          borderRadius: '12px',
          ':hover': {
            bgcolor: 'action.hover',
            cursor: 'pointer',
          },
          transition: 'border-color 0.3s',
        }}
        onClick={handleClick}
      >
        <Box sx={{
          padding: 1.5,
        }}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs={12} md={4}>
              {industryIcons[companyDetails.industry] ? React.createElement(industryIcons[companyDetails.industry], { sx: { verticalAlign: 'middle', mr: 2, color: '#779c73', fontSize: '4rem' } }) : null}
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>{companyDetails.name}</Typography>
              {companyDetails.company_name && (<Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>{companyDetails.company_name}</Typography>
              )}
            </Grid>
          </Grid>
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: investmentAmount ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 1.5,
        }}>
          {!investmentAmount && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" component="span" sx={{ fontWeight: 'bold' }}>
                {companyDetails.esg_rating}
              </Typography>
              <Typography variant="subtitle1" sx={{ display: 'block' }}>
                ESG Rating
              </Typography>
            </Box>
          )}
          {!investmentAmount && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" component="span" sx={{ fontWeight: 'bold' }}>
                {companyDetails.industry_ranking}
              </Typography>
              <Typography variant="subtitle1" sx={{ display: 'block' }}>
                Industry Ranking
              </Typography>
            </Box>
          )}
          {investmentAmount && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" component="span" sx={{ fontWeight: 'bold' }}>
                ${investmentAmount.toLocaleString()}
              </Typography>
            </Box>
          )}
          {impactStatement && (
            <Typography sx={{ fontSize: '1rem', mt: 1 }}>{impactStatement}</Typography>
          )}
        </Box>
      </Card>
    </div>
  );
};

export default CompanyCard;
