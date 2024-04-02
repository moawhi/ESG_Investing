import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import FrameworkSelection from './FrameworkSelection';
import Topbar from './Topbar';
import { useLocation } from 'react-router-dom';

const CompanyInfo = () => {
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { company } = location.state;

  const companyName = company.name;
  const companyId = company.company_id;

  const [frameworks, setFrameworks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams({ company_id: companyId }).toString();
    const fetchFrameworks = async () => {
      try {
        const response = await fetch(`http://localhost:12345/framework/list?${queryParams}`, {
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

  return (
    <div>
      <Topbar />
      <Box>
        <Box>
          <Typography>{companyName}</Typography>
          <Typography>Insert Info Here</Typography>
        </Box>
        <Button variant="contained" onClick={handleOpen}>Select Framework</Button>
        <FrameworkSelection open={open} onClose={handleClose} frameworks={frameworks}/>
      </Box>
    </div>
  )
}

export default CompanyInfo;