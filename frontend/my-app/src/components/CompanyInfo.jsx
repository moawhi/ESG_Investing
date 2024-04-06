import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Accordion, AccordionSummary, AccordionDetails, Box, FormControlLabel, Checkbox, Typography, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import DevicesIcon from '@mui/icons-material/Devices';
import FactoryIcon from '@mui/icons-material/Factory';
import FrameworkSelection from './FrameworkSelection';
import Topbar from './Topbar';

const CompanyInfo = () => {
  const location = useLocation();

  const { company } = location.state;

  const companyId = company.company_id;

  const [companyDetails, setCompanyDetails] = useState([]);
  const [frameworks, setFrameworks] = useState([]);
  const [metricDetails, setMetricDetails] = useState([]);

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
        console.log(responseData.esg_data);
      } else {
        const errorBody = await response.json();
        console.error(errorBody.message);
      }
    }
    catch (error) {
      console.error('Error fetching esg details:', error);
    }
  };

  const industryIcons = {
    Technology: DevicesIcon,
    Energy: EnergySavingsLeafIcon,
    Finance: AttachMoneyIcon,
    Manufacturing: FactoryIcon
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
            {metricDetails.map((metric) => (
            <Accordion sx={{ border: '1px solid #e0e0e0' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Grid container>
                <Grid item xs={7.25}>
                  <Typography variant="h6">{metric.framework_metric_name}</Typography>
                </Grid>
                <Grid item xs={3}>
                <Typography variant="h6">{metric.framework_metric_weight}</Typography>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              {metric.indicators.map((indicator) => (
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          // handle checkbox functionality later
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={6} sx={{ borderRight: '1px solid #e0e0e0' }}>
                    <Typography>{indicator.indicator_name}</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ borderRight: '1px solid #e0e0e0' }}>
                    <Typography>{indicator.indicator_weight}</Typography>
                  </Grid>
                  <Grid item xs={1} sx={{ borderRight: '1px solid #e0e0e0' }}>
                    <Typography>{indicator.indicator_score_2022}</Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography>{indicator.indicator_score_2023}</Typography>
                  </Grid>
                </Grid>
              ))}
            </AccordionDetails>
            </Accordion>
            ))}
          </Box>
        </Grid>
      </Grid>
    </div>
  )
}

export default CompanyInfo;