import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/**
 * Delete dialog component, this to alert user once deleting a company
 * @param {companyDetail, onCompanyDeleted}
 * @returns Delete dialog component
 */
export default function DeleteDialog({ companyDetail, onCompanyDeleted }) {
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

  // fetch to delete a company from the portfolio
  const handleDelete = async () => {
    try {
      const response = await fetch('http://localhost:12345/portfolio/delete-company', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorisation: 'Bearer ' + token,
        },
        body: JSON.stringify({
          company_id: companyDetail.company_id
        })
      });

      const result = await response.json();
      if (response.ok) {
        setSnackbarMessage('Company deleted successfully!');
        setSnackbarSeverity('success');
        onCompanyDeleted(companyDetail.company_id);
      } else {
        setSnackbarMessage(`Failed to delete company: ${result.message}`);
        setSnackbarSeverity('error');
      }
    } catch (error) {
      setSnackbarMessage(`Failed to delete company: ${error.message}`);
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
          backgroundColor: '#dc3545', // Danger color
          color: '#FFFFFF',
          borderRadius: '8px',
          padding: '0.375rem 0.75rem', // Slightly smaller for dialog actions
          fontWeight: 'bold', // Kept bold as it was there
          '&:hover': {
            backgroundColor: '#c82333'
          }
        }}>
        Delete
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ // Dialog Paper styling
          sx: {
            borderRadius: '12px',
            boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        {/* DialogTitle should inherit global typography */}
        <DialogTitle>Delete {companyDetail.company_name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this company from your portfolio? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 2}}> {/* Added padding to actions */}
          <Button
            onClick={handleClose}
            sx={{
              color: '#6C757D', // Secondary/text button style
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{
              backgroundColor: '#dc3545', // Danger color
              color: '#FFFFFF',
              borderRadius: '8px',
              padding: '0.375rem 0.75rem',
              fontWeight: 'bold', // Kept bold
              '&:hover': {
                backgroundColor: '#c82333',
              }
            }}
          >
            Delete
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
