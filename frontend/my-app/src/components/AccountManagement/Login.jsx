/* handles logic and styling of login page */
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { Paper, Box, Grid, Avatar, Button, CssBaseline, TextField, Typography} from '@mui/material/';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="">
        HighFive
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

// gets email and password and verifies user can log in
// upon successful log in, navigates to dashboard and receives token for this session
// otherwise displays error and doesn't log in
export default function Login() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const email_address = data.get('email');
    const password = data.get('password');
    try {
      const response = await fetch('http://localhost:12345/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address, password
        }),
      })

      if (response.ok) {
        const resBody = await response.json();
        if (resBody.status === "success") {
          localStorage.setItem('token', resBody.token);
          localStorage.setItem('firstName', resBody.first_name);
          localStorage.setItem('lastName', resBody.last_name);
          navigate('/dashboard');
        } else {
          setErrorMessage(resBody.message);
        }
      } else {
        const errorBody = await response.json();
        setErrorMessage(errorBody.message || 'Network or server error.');
      }
    } catch (error) {
      setErrorMessage('An error occurred: ' + error.message);
    }
  };

  // styling for login page
  return (
    <ThemeProvider theme={defaultTheme}>
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
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
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
              display: 'flex',
              flexGrow: 1,
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, backgroundColor: '#9ec28c' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: "#9ec28c", 
                '&:hover': {
                  backgroundColor: "#8aab79",
                }}}
              >
                Sign In
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/register" variant="body2">
                    {"Don't have an account? Sign up"}
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
                  backgroundColor: "#ffdede",
                  borderRadius: "10px",
                  width: "100%"
                }} 
              > <ErrorOutlineIcon sx={{ mr: 1, color: "red" }} />
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
  </ThemeProvider>
  );
}