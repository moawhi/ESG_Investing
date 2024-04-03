import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Accordion, AccordionSummary, AccordionDetails, Box, Button, Typography, Grid } from '@mui/material';
//import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FrameworkSelection from './FrameworkSelection';
import Topbar from './Topbar';

const CompanyInfo = () => {
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
  

  return (
    <div>
      <Topbar />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h5">{companyDetails.name}</Typography>
            <Typography>{companyDetails.info}</Typography>
            <Typography>ESG Rating: {companyDetails.esg_rating}</Typography>
            <Typography>Industry: {companyDetails.industry}</Typography>
            <Typography>Industry Ranking: {companyDetails.industry_ranking}</Typography>
          </Box>
          <Button variant="contained" onClick={handleOpen}>Select Framework</Button>
          <FrameworkSelection open={open} onClose={handleClose} frameworks={frameworks} onSelectFramework={handleFrameworkSelection}/>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ maxHeight: 'calc(100vh - 100px)', overflow: 'auto' }}>
            {metricDetails.map((detail, index) => (
              <Box key={index} sx={{ borderBottom: 1, borderColor: 'divider', padding: 2 }}>
                <Typography variant="h6">{detail.framework_metric_name}</Typography>
                <Typography variant="body2">Weight: {detail.framework_metric_weight}</Typography>
                <Typography variant="body2">Indicator Name: {detail.metric_name}</Typography>
                <Typography variant="body2">Year: {detail.metric_year}</Typography>
                <Typography variant="body2">Indicator Weight: {detail.indicator_weight}</Typography>
                <Typography variant="body2">Metric Score: {detail.metric_score}</Typography>
                <Typography variant="body2" sx={{ marginBottom: 2 }}>
                  Indicator Description: {detail.indicator_description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </div>
  )
}

export default CompanyInfo;