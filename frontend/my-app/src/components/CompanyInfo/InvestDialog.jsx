/* handles logic and styling of popup dialog box for adding investments */

import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function InvestDialog({ companyDetail }) {
  const [open, setOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
  const token = localStorage.getItem('token');
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const investment_amount = formData.get('investAmount');
    const comment = formData.get('Comment');

    try {
      const response = await fetch('http://localhost:12345/portfolio/save-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorisation': 'Bearer ' + token,
        },
        body: JSON.stringify({
          company_id: companyDetail.company_id,
          investment_amount,
          comment
        })
      });

      const result = await response.json();
      if (response.ok) {
        setSnackbarMessage('Company added to Portfolio successfully!');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage(`Failed to add company: ${result.message}`);
        setSnackbarSeverity('error');
      }
    } catch (error) {
      setSnackbarMessage(`Failed to add company: ${error.message}`);
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
    handleClose();
  };

  return (
    <React.Fragment>
      <Button
        onClick={handleClickOpen}
        variant="contained"
        sx={{
          backgroundColor: '#28a745', // Primary Green Accent
          color: '#FFFFFF',
          borderRadius: '8px',
          fontWeight: 'bold', // Kept bold as per instruction
          padding: '0.5rem 1rem',
          '&:hover': {
            backgroundColor: '#218838'
          }
        }}>
        Add to Portfolio
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
          sx: { // Merged sx with existing PaperProps
            borderRadius: '12px',
            boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <DialogTitle variant="h6">Add {companyDetail.name} to my Portfolio</DialogTitle> {/* Use variant */}
        <DialogContent sx={{pt: {xs: 1, sm: '20px !important'}}}> {/* Ensure adequate top padding */}
          <DialogContentText variant="body1" sx={{ color: '#6C757D', mb:2 }}> {/* Ensure styling and margin */}
            To save this company to your Portfolio, please enter your investing amount and an optional comment. We
            will update immediately.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="investAmount"
            label="Investing Amount"
            type="number"
            fullWidth
            variant="outlined" // Changed to outlined
            inputProps={{
              min: 0
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }, mb: 2 }} // Added borderRadius and margin
          />
          <TextField
            margin="dense"
            id="comment"
            name="Comment"
            label="Comment (Optional)"
            type="text"
            fullWidth
            variant="outlined" // Changed to outlined
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }, mb: 2 }} // Added borderRadius and margin
          />
        </DialogContent>
        <DialogActions sx={{p:2}}> {/* Added padding to DialogActions */}
          <Button
            onClick={handleClose}
            sx={{
              color: '#6C757D',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#28a745',
              color: '#FFFFFF',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#218838'
              },
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose}>
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          iconMapping={{
            success: <CheckCircleIcon fontSize="inherit" />,
            error: <ErrorIcon fontSize="inherit" />
          }}
          sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
