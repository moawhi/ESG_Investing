/* handles logic and styling of popup dialog box for adding metrics */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, List, ListItem, Checkbox, FormControlLabel, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';


const AddMetricPopup = ({ open, setOpenMetricPopup, frameworkId, onAddMetrics }) => {
  const [additionalMetrics, setAdditionalMetrics] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  // upon closing the popup, resets error message 
  const handleClose = () => {
    setOpenMetricPopup(false);
    setErrorMessage("");
  };

  // when framework id or open state changes, fetches unincluded metrics
  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchAdditionalMetrics = async () => {
      try {
        const response = await fetch(`http://localhost:12345/framework/${frameworkId}/unincluded-metrics`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorisation': 'Bearer ' + token,
          },
          });
        if (response.ok) {
          const responseData = await response.json();
          setAdditionalMetrics(responseData.metrics);
        } else {
          const errorBody = await response.json();
          console.error(errorBody.message);
        }
      } catch (error) {
          console.error('Error fetching additional metrics', error);
      }
    };
    if (open) {
      fetchAdditionalMetrics();
    }
  }, [frameworkId, open]);

  // when different framework is selected, reset selected metrics
  useEffect(() => {
    setSelectedMetrics({});
  }, [frameworkId]);

  // puts checked metrics in selectedMetrics dict
  // if more than 5 are selected, display error message and prevent selecting of 6th metric
  const handleToggle = metricId  => {
    const currentlySelectedCount = Object.values(selectedMetrics).filter(val => val).length;
    const isSelected = selectedMetrics[metricId];
    if (!isSelected && currentlySelectedCount >= 5) {
      setErrorMessage("You can only select up to 5 metrics.");
    } else {
      setSelectedMetrics(prev => ({
        ...prev,
        [metricId]: !prev[metricId]
      }));
      if (errorMessage) {
        setErrorMessage(""); 
      }
    }
  };

  // upon submission, return ids of selected metrics and close popup
  const handleSubmission = () => {
    const selectedMetricIds = additionalMetrics.filter((_, id) => selectedMetrics[id]).map(metric => metric.metric_id);
    onAddMetrics(selectedMetricIds);
    handleClose();
  };

  // styling of add metrics popup dialog
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.1)',
            // Removed height constraint from here, let content define it or control via sx on Dialog if really needed
          }
        }}
        // sx={{ // Removed this sx block that was constraining height unnecessarily from Dialog
        //   display: 'flex',
        //   alignItems: 'center',
        //   justifyContent: 'center',
        // }}
      >
        <DialogTitle variant="h6">Choose metrics to add:</DialogTitle> {/* Use variant */}
        <DialogContent sx={{pt: 1}}> {/* Adjusted padding top */}
        {additionalMetrics.length > 0 ? (
            <List>
              {additionalMetrics.map((metric, id) => (
                <ListItem key={metric.metric_id} sx={{pl:0, pr:0}}> {/* Adjusted ListItem padding */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!selectedMetrics[id]}
                        onChange={() => handleToggle(id)}
                        name={`checkbox-${id}`}
                        sx={{
                          color: '#6C757D', // Unchecked color
                          '&.Mui-checked': {
                            color: '#28a745', // Checked color
                          },
                        }}
                      />
                    }
                    label={
                      // Removed React.Fragment as Typography alone is fine
                      <Typography variant="body1">{metric.metric_name}</Typography> // Changed to body1
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No metrics available.</Typography>
          )}
        </DialogContent>
        {errorMessage && (
          <Box
            sx={{
              p: 1, // Adjusted padding
              ml: 2, // Margin left for alignment with DialogContent padding
              mr: 2, // Margin right for alignment
              display: "flex",
              alignItems: "center",
              backgroundColor: '#f8d7da', // Error background
              color: '#721c24', // Error text color
              borderRadius: '8px', // Rounded corners
              border: '1px solid #f5c6cb', // Error border
              // width: "auto" // Let content define width or use 100% if spanning full Dialog width minus padding
            }}
          >
            <ErrorOutlineIcon sx={{ mr: 1, color: '#721c24' }} /> {/* Error icon color */}
            <Typography variant="body2">{errorMessage}</Typography>
          </Box>
        )}
        <DialogActions sx={{ p:2 }}> {/* Added padding to DialogActions */}
          <Button 
            onClick={handleSubmission}
            variant="contained" // Make it a contained button for primary action
            sx={{
              backgroundColor: '#28a745',
              color: '#FFFFFF',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#218838'
              },
              // mr: 1, // Kept margin if needed for spacing with other buttons
              // mb: 1  // Kept margin if needed
            }}
          >
            Add Metrics
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddMetricPopup;