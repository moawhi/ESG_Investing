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
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <DialogTitle variant="h6">Please enter a new weight:</DialogTitle> {/* Use variant */}
        <DialogContent sx={{pt: {xs: 1, sm: '20px !important'}}}> {/* Ensure adequate top padding */}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="New Weight"
            type="number"
            fullWidth
            variant="outlined" // Changed to outlined
            inputProps={{
              step: 0.05,
              min: 0,  
              max: 1  
            }}
            onChange={(e) => setWeightInput(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} // Added borderRadius
          />
          {errorMessage && (
            <Box 
              sx={{
                mt: 2, // Added margin top for spacing
                p: 1,
                display: "flex",
                alignItems: "center",
                backgroundColor: '#f8d7da', // Error background
                color: '#721c24', // Error text color
                borderRadius: '8px', // Rounded corners
                border: '1px solid #f5c6cb', // Error border
              }} 
            >
              <ErrorOutlineIcon sx={{ mr: 1, color: '#721c24' }} /> {/* Error icon color */}
              <Typography variant="body2">{errorMessage}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}> {/* Added padding to DialogActions */}
          <Button 
            onClick={handleSubmission}
            variant="contained" // Make it a contained button
            sx={{
              backgroundColor: '#28a745',
              color: '#FFFFFF',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#218838'
              },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChangeWeightPopup;
