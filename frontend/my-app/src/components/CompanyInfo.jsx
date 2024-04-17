import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {Box, Grid } from '@mui/material';
import Topbar from './Topbar';
import CompanyDetails from './CompanyDetails';
import FrameworkSelection from './FrameworkSelection';
import MetricAccordion from './MetricAccordion';

const CompanyInfo = () => {
  const location = useLocation();
  const companyId = location.state;
  const [selectedFrameworkId, setSelectedFrameworkId] = useState(null);

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
            <CompanyDetails companyId={companyId} />
            <Box sx={{ 
              flex: 1
            }}> 
              <FrameworkSelection companyId={companyId} onSelectFramework={setSelectedFrameworkId}/>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <MetricAccordion companyId={companyId} selectedFrameworkId={selectedFrameworkId}/>
        </Grid>
      </Grid>
    </div>
  )
}

export default CompanyInfo;