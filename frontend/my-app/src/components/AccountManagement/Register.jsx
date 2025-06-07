/* handles logic and styling of register page */
import * as React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { Paper, Box, Grid, Avatar, Button, CssBaseline, TextField, Typography} from '@mui/material/';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
// import { createTheme, ThemeProvider } from '@mui/material/styles'; // Removed ThemeProvider

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      {/* Applied link styling directly for Copyright, as MUI Link component might override global 'a' */}
      <Link style={{ color: '#007BFF', textDecoration: 'none' }} href="https://mui.com/">
        HighFive
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// const defaultTheme = createTheme(); // Removed ThemeProvider

// upon successful register navigates user to dashboard and receives token for this session
// otherwise displays error and doesn't register account
export default function Register() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const first_name = data.get('firstName');
    const last_name = data.get('lastName');
    const email_address = data.get('email');
    const password = data.get('password');

    try {
      const response = await fetch('http://localhost:12345/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name,
          last_name,
          email_address,
          password
        }),
      });

      if (response.ok) {
        const resBody = await response.json();
        if (resBody.status === "success") {
          localStorage.setItem('token', resBody.token);
          localStorage.setItem('firstName', resBody.first_name);
          localStorage.setItem('lastName', resBody.last_name);
          localStorage.setItem('email', resBody.email);
          navigate('/dashboard');
        } 
      } else {
        const errorBody = await response.json();
        setErrorMessage(errorBody.message || 'Network or server error.');
      }
    } catch (error) {
      setErrorMessage('An error occurred: ' + error.message);
    }
  };


  return (
    // <ThemeProvider theme={defaultTheme}> // Removed ThemeProvider
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={8}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            // backgroundColor: (t) => // Default background from index.css will apply
            //   t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid
          item
          xs={12}
          sm={8}
          md={4}
          component={Paper}
          // elevation={6} // Using boxShadow instead
          // square // Removing square for rounded corners
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%', 
            }}
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, backgroundColor: "#28a745" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      autoFocus
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography sx={{ fontSize: '0.8rem', color: '#6C757D' }}>
                      Password Requirements:
                    </Typography>
                    <Box sx={{ paddingLeft: 1, typography: 'body2', fontSize: '0.8rem', color: '#6C757D' }}>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
                      <li>at least 1 upper case letter.</li>
                      <li>at least 1 lower case letter.
                      <li>at least 1 number.</li>
                      <li>at least 1 special character.</li>
                      <li>at least 8 characters.</li>
                    </ul>
                  </Box>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: "#28a745",
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: "#218838",
                    }
                  }}
                >
                  Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    {/* Link from react-router-dom should pick up global 'a' styles */}
                    <Link to="/login" variant="body2">
                      {"Already have an account? Sign in"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
              {errorMessage && (
                <Box 
                  sx={{
                    mt: 2,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    borderRadius: '8px',
                    border: '1px solid #f5c6cb',
                    width: "100%"
                  }}
                >
                  <ErrorOutlineIcon sx={{ mr: 1, color: "#721c24" }} />
                  <Typography variant="body2">{errorMessage}</Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    // </ThemeProvider> // Removed ThemeProvider
  );
}