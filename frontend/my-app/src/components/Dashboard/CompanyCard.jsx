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
          // height: '200px', // Replaced by auto height and minHeight
          height: 'auto',
          minHeight: '200px',
          width: '100%',
          border: selected ? '2px solid #28a745' : 'none', // Removed default border, reduced selected border
          borderRadius: '12px', // Style Guide standard
          boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)', // Style Guide shadow
          ':hover': {
            bgcolor: 'rgba(0, 0, 0, 0.02)',
            boxShadow: '0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)',
            border: selected ? '2px solid #28a745' : '2px solid #E0E0E0', // Subtle border on hover for non-selected
            cursor: 'pointer',
          },
          transition: 'border 0.3s, box-shadow 0.3s', // Updated transition to include border
        }}
        onClick={handleClick}
      >
        <Box sx={{
          padding: 2, // Updated padding
        }}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs={12} md={4}>
              {industryIcons[companyDetails.industry] ? React.createElement(industryIcons[companyDetails.industry], { sx: { verticalAlign: 'middle', mr: 2, color: '#28a745', fontSize: '4rem' } }) : null}
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#212529' }}>{companyDetails.name}</Typography>
              {companyDetails.company_name && (<Typography sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#212529' }}>{companyDetails.company_name}</Typography>
              )}
            </Grid>
          </Grid>
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: investmentAmount ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 2, // Updated padding
        }}>
          {!investmentAmount && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" component="span" sx={{ fontWeight: 'bold', color: '#212529' }}> {/* Changed to h5 */}
                {companyDetails.esg_rating}
              </Typography>
              <Typography variant="subtitle1" sx={{ display: 'block', color: '#6C757D' }}>
                ESG Rating
              </Typography>
            </Box>
          )}
          {!investmentAmount && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" component="span" sx={{ fontWeight: 'bold', color: '#212529' }}> {/* Changed to h5 */}
                {companyDetails.industry_ranking}
              </Typography>
              <Typography variant="subtitle1" sx={{ display: 'block', color: '#6C757D' }}>
                Industry Ranking
              </Typography>
            </Box>
          )}
          {investmentAmount && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" component="span" sx={{ fontWeight: 'bold', color: '#212529' }}>
                ${investmentAmount.toLocaleString()}
              </Typography>
            </Box>
          )}
          {impactStatement && (
            <Typography sx={{ fontSize: '1rem', mt: 1, color: '#212529' }}>{impactStatement}</Typography> // Assuming primary text color for impact statement
          )}
        </Box>
      </Card>
    </div>
  );
};

export default CompanyCard;
