import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Snackbar, Alert } from '@mui/material';

/**
 * Update dialog component, this to alert user update password
 * @param {open, handleClose}
 * @returns Popup dialog component to enter new password and notify the result
 */
export default function UpdatePasswordDialog({ open, handleClose }) {
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [error, setError] = useState(false);

  const updatePassword = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:12345/user/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorisation: 'Bearer ' + token,
        },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      if (response.ok) {
        setSnackbarMessage('Password updated successfully!');
        setError(false);
      } else {
        setSnackbarMessage(data.message || 'Failed to update password.');
        setError(true);
      }
    } catch (error) {
      setSnackbarMessage('Network error.');
      setError(true);
    }
    setSnackbarOpen(true);
    handleClose();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            color="success"
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#8eb08b" }} onClick={handleClose}>Cancel</Button>
          <Button sx={{
            backgroundColor: "#8eb08b",
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: "#779c73",
            }
          }} onClick={updatePassword}
          variant='contained'>Update</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={error ? "error" : "success"} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
