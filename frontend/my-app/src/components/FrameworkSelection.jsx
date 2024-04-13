import React, { useState } from 'react';
import { Box, RadioGroup, Radio, FormControlLabel, Typography } from '@mui/material';

const FrameworkSelection = ({ frameworks, onSelectFramework }) => {

  const [selectedFramework, setSelectedFramework] = useState('');

  const handleChange = (event) => {
    const newFramework = event.target.value;
    setSelectedFramework(newFramework);;
    onSelectFramework(newFramework);
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