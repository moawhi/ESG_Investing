import React, { useState, useEffect } from 'react';
import { Box, RadioGroup, Radio, FormControlLabel, Typography } from '@mui/material';

const FrameworkSelection = ({ companyId, onSelectFramework }) => {
  const [frameworks, setFrameworks] = useState([]);
  const [selectedFramework, setSelectedFramework] = useState('');

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
  
  const handleChange = (event) => {
    const newFrameworkId = event.target.value;
    setSelectedFramework(newFrameworkId);
    onSelectFramework(newFrameworkId);
  };

  return (
    <Box       
      sx = {{ pt: 4, pl: 4, pr: 4 }}>
      <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
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
              sx= {{color: "#779c73",
              '&.Mui-checked': {
                color: "#779c73",
              },}}/>}
              label={
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ fontSize: '1.2rem', mb: 0.5 }}>{framework.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
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