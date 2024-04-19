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
          backgroundColor: "#8eb08b",
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: "#779c73",
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
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Add {companyDetail.name} to my Portfolio</DialogTitle>
        <DialogContent>
          <DialogContentText>
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
            variant="standard"
            inputProps={{
              min: 0
            }}
          />
          <TextField
            margin="dense"
            id="comment"
            name="Comment"
            label="Comment (Optional)"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
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
