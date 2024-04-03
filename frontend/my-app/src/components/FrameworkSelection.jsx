import React, { useState } from 'react';
import { Modal, Box, RadioGroup, Radio, FormControlLabel, Button, Typography } from '@mui/material';

const FrameworkSelection = ({ open, onClose, frameworks, onSelectFramework }) => {

  const [selectedFramework, setSelectedFramework] = useState('');
  const [showError, setShowError] = useState(false);

  const handleChange = (click) => {
    setSelectedFramework(click.target.value);
    setShowError(false);
  };

  const handleFrameworkSelection = () => {
    if (selectedFramework) {
      onSelectFramework(selectedFramework);
      onClose(); 
    } else {
      setShowError(true); 
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleFrameworkSelection}
    >
      <Box       
        sx = {{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: '16px',
        boxShadow: 16,
        p: 4,
      }}>
        <Typography id="select-framework-modal" variant="h6" component="h2">
          Select a Framework
        </Typography>
        <Box id="select-framework-modal" 
        sx={{
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5, 
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
                control={<Radio />}
                label={
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body1">{framework.name}</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                      {framework.info}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </RadioGroup>
          {showError && (
          <Typography color="error" sx={{ mt: 1, fontSize: '0.8rem' }}>
            Please select a framework.
          </Typography>
        )}
          <Box sx={{ mt: 1 }}>
            <Button 
            onClick={handleFrameworkSelection}
            sx={{
              color: '#779c73'
            }}> 
            Select</Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default FrameworkSelection;