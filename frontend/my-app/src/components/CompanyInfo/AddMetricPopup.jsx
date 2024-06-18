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
      <Dialog open={open} onClose={handleClose}
      sx={{
        display: 'flex',
        alignItems: 'center',  
        justifyContent: 'center',
        '& .MuiDialog-container': {
        height: '60%'
    }
      }}>
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Choose metrics to add:</DialogTitle>
        <DialogContent>
        {additionalMetrics.length > 0 ? (
            <List>
              {additionalMetrics.map((metric, id) => (
                <ListItem key={metric.metric_id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!selectedMetrics[id]}
                        onChange={() => handleToggle(id)}
                        name={`checkbox-${id}`}
                        sx={{color: "#779c73",
                          '&.Mui-checked': {
                          color: "#779c73",
                        }}}
                      />
                    }
                    label={
                      <React.Fragment>
                        <Typography variant="h6">{metric.metric_name}</Typography>
                      </React.Fragment>
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
                mt: 1,
                ml: 3,
                p: 1,
                display: "flex",
                alignItems: "center",
                backgroundColor: "#ffdede",
                borderRadius: "10px",
                width: "85%"
              }} 
            > <ErrorOutlineIcon sx={{ mr: 1, color: "red" }} />
              <Typography variant="body2">{errorMessage}</Typography>
            </Box>
        )}
        <DialogActions>
          <Button 
          onClick={handleSubmission}
          sx={{
            mr: 1,
            mb: 1,
            color: '#779c73', 
            '&:hover': {
              backgroundColor: "#daf0d8",
          }}}>Add Metrics</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddMetricPopup;