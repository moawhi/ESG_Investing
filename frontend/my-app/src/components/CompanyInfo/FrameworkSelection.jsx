/* handles logic and styling of framework selection component of company info page */

import React, { useState, useEffect } from 'react';
import { Box, RadioGroup, Radio, FormControlLabel, Typography } from '@mui/material';

const FrameworkSelection = ({ companyId, onSelectFramework }) => {
  const [frameworks, setFrameworks] = useState([]);
  const [selectedFramework, setSelectedFramework] = useState('');

  // fetches frameworks every time new company is selected
  useEffect(() => {
    const fetchFrameworks = async () => {
      const token = localStorage.getItem('token');
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
  
  // change frameworkId when new framework is selected
  const handleChange = (event) => {
    const newFrameworkId = event.target.value;
    setSelectedFramework(newFrameworkId);
    onSelectFramework(newFrameworkId);
  };

  // styling of framework selection component
  return (
    <Box sx={{ padding: 3 }}> {/* Updated padding */}
      <Typography variant="h4" sx={{ color: '#212529' }}> {/* Use variant and ensure color */}
        Select a Framework
      </Typography>
      <Box
      sx={{
        mt: 2,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '45vh',
        overflow: 'auto'
        }}>
        <RadioGroup
          name="framework-selection"
          value={selectedFramework}
          onChange={handleChange}
        >
          {frameworks.map((framework) => (
            <FormControlLabel
              key={framework.framework_id}
              value={framework.framework_id.toString()}
              control={<Radio 
                sx={{
                  color: '#6C757D', // Secondary text color for unchecked
                  '&.Mui-checked': {
                    color: '#28a745', // Primary green accent for checked
                  },
                }}
              />}
              label={
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6">{framework.name}</Typography> {/* Changed to h6 */}
                  <Typography variant="body2" color="textSecondary"> {/* Kept as is, textSecondary is good */}
                    {framework.info}
                  </Typography>
                </Box>
              }
            />
          ))}
        </RadioGroup>
      </Box>
    </Box>
  );
};

export default FrameworkSelection;