import React from 'react';
import { Modal, Box, Checkbox, FormControlLabel, Button, Typography } from '@mui/material';

const FrameworkSelection = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
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

        <Typography id="select-framework-modal-title" variant="h6" component="h2">
          Select Frameworks
        </Typography>
        <Box id="select-framework-modal-description" 
        sx={{
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5, 
          }}>
          <FormControlLabel control={<Checkbox />} label="Framework 1" />
          <FormControlLabel control={<Checkbox />} label="Framework 2" />
          <FormControlLabel control={<Checkbox />} label="Framework 3" />
          <Box>
            <Button onClick={onClose}>Close</Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default FrameworkSelection;