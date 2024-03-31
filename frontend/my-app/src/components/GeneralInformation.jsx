import React from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

const GeneralInformation = () => {
  return (
    <form noValidate autoComplete="off">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            label="First Name"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            label="Last Name"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            label="Birthday"
            type="date"
            defaultValue="mm/dd/yyyy"
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select
              defaultValue=""
              label="Gender"
              required
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Prefer not to say</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            type="email"
            label="Email"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            label="Phone"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            label="Address"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            label="Suburb"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            label="City"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>State</InputLabel>
            <Select
              defaultValue=""
              label="State"
              required
            >
              <MenuItem value="state1">NSW</MenuItem>
              <MenuItem value="state2">VIC</MenuItem>
              <MenuItem value="state2">WA</MenuItem>
              <MenuItem value="state2">TAS</MenuItem>
              <MenuItem value="state2">QLD</MenuItem>
              <MenuItem value="state2">SA</MenuItem>
              <MenuItem value="state2">ACT</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            label="Postcode"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary">
            Save All
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default GeneralInformation;
