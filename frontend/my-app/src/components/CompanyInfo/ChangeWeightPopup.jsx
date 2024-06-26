/* handles logic and styling of popup dialog box for changing weights */

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';


const ChangeWeightPopup = ({ open, setOpenWeightPopup, handleSubmitNewWeight }) => {
  const [weightInput, setWeightInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // upon closing the popup, resets error message and input box
  const handleClose = () => {
    setOpenWeightPopup(false);
    setErrorMessage('');
    setWeightInput('');
  };

  // upon submission, check if weight is valid. If not valid, display error message. 
  // If valid, return weight.
  const handleSubmission = () => {
    const weight = parseFloat(weightInput);
    if (isNaN(weight) || weight < 0 || weight > 1) {
      setErrorMessage('Please enter a valid weight between 0 and 1.'); 
    } else {
      handleSubmitNewWeight(weight);
      handleClose();
    }
  };

  // styling of change weight popup dialog
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Please enter a new weight:</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="New Weight"
            type="number"
            fullWidth
            variant="standard"
            inputProps={{
              step: 0.05,
              min: 0,  
              max: 1  
            }}
            onChange={(e) => setWeightInput(e.target.value)}
          />
          {errorMessage && (
            <Box 
              sx={{
                mt: 1,
                p: 1,
                display: "flex",
                alignItems: "center",
                backgroundColor: "#ffdede",
                borderRadius: "10px",
                width: "90%"
              }} 
            > <ErrorOutlineIcon sx={{ mr: 1, color: "red" }} />
              <Typography variant="body2">{errorMessage}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
          onClick={handleSubmission}
          sx={{
            mr: 1,
            mb: 1,
            color: '#779c73', 
            '&:hover': {
              backgroundColor: "#daf0d8",
          }}}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChangeWeightPopup;
