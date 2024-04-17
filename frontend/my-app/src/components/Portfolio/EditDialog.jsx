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

export default function EditDialog({ companyDetail, onCompanyUpdated }) {
  const [open, setOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
  const [investmentAmount, setInvestmentAmount] = React.useState(companyDetail.investment_amount);
  const [comment, setComment] = React.useState(companyDetail.comment);
  const [isSaveDisabled, setIsSaveDisabled] = React.useState(true); // Initially, save button is disabled

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
      const response = await fetch('http://localhost:12345/portfolio/edit', {
        method: 'PUT',
        headers: {
					'Content-Type': 'application/json',
					Authorisation: 'Bearer ' + token,
        },
        body: JSON.stringify({
          company_id: companyDetail.company_id,
          investment_amount,
          comment
        })
      });

      const result = await response.json();
      if (response.ok) {
        setSnackbarMessage('Company details updated successfully!');
        setSnackbarSeverity('success');
        onCompanyUpdated({
          ...companyDetail,
          investment_amount: investmentAmount,
          comment
        });
      } else {
        setSnackbarMessage(`Failed to update company details: ${result.message}`);
        setSnackbarSeverity('error');
      }
    } catch (error) {
      setSnackbarMessage(`Failed to update company details: ${error.message}`);
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
    handleClose();
  };

  // Update state and check if save button should be enabled whenever there's a change in input fields
  React.useEffect(() => {
    setIsSaveDisabled(investmentAmount === companyDetail.investment_amount && comment === companyDetail.comment);
  }, [investmentAmount, comment, companyDetail]);

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
        Edit
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Edit Investment for {companyDetail.company_name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To update this company in your Portfolio, please edit your investing amount or comment.
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
            defaultValue={companyDetail.investment_amount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
          />
          <TextField
            margin="dense"
            id="comment"
            name="Comment"
            label="Comment (Optional)"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={companyDetail.comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" disabled={isSaveDisabled} variant={isSaveDisabled ? "outlined" : "contained"} >Save</Button>
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
