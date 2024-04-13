import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
//import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';


const AddMetricPopup = ({ open, setOpenMetricPopup }) => {

  const handleClose = () => {
    setOpenMetricPopup(false);
  };

  const handleSubmission = () => {
    handleClose();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Metrics</DialogTitle>
        <DialogContent>
          <Typography>Metric stuff goes here</Typography>
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

export default AddMetricPopup;