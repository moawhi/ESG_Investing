import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, Snackbar, Alert } from '@mui/material';
import { useUser } from './UserContext';

const GeneralInformation = () => {
  const { user, updateUser } = useUser();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [error, setError] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  // Effect to handle enabling/disabling the Save All button
  useEffect(() => {
    if (firstName !== user.firstName || lastName !== user.lastName || email !== user.email) {
      setIsSaveDisabled(false);
    } else {
      setIsSaveDisabled(true);
    }
  }, [firstName, lastName, email, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      Authorisation: 'Bearer ' + token,
    };

    const body = JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      email_address: email
    });

    try {
      const response = await fetch('http://localhost:12345/user/update-details', {
        method: 'PUT',
        headers: headers,
        body: body
      });
      const data = await response.json();
      if (response.ok) {
        updateUser({ firstName, lastName, email });
        setSnackbarMessage('Details updated successfully!');
        setError(false);
      } else {
        setSnackbarMessage(data.message || 'Failed to update details.');
        setError(true);
      }
    } catch (err) {
      setSnackbarMessage('Network error.');
      setError(true);
    }

    setSnackbarOpen(true);
  };

  return (
    <form noValidate autoComplete="off" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            label="First Name"
            fullWidth
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            label="Last Name"
            fullWidth
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            type="email"
            label="Email"
            fullWidth
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained"
            sx={{
              backgroundColor: "#8eb08b",
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: "#779c73",
              }
            }}
            disabled={isSaveDisabled}>
            Save All
          </Button>
        </Grid>
      </Grid>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={error ? "error" : "success"}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default GeneralInformation;
