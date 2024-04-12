import React, { useState, useEffect } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, Grid, Checkbox, FormControlLabel, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ChangeWeightPopup from './ChangeWeightPopup';

const MetricAccordion = ({ metricDetails }) => {
  const [checkedAccordions, setCheckedAccordions] = useState({});
  const [esgScore, setEsgScore] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [weights, setWeights] = useState({});
  const [weightType, setWeightType] = useState('');
  const [accordionIndex, setAccordionIndex] = useState('');
  const [indicatorIndex, setIndicatorIndex] = useState('');
  const [errorMessage, setErrorMessage] = React.useState('');


  useEffect(() => {
    // Initialize the checked state for each accordion based on framework selected
    const initialCheckedState = {};
    const initialWeights = {};
    metricDetails.forEach((metric, index) => {
      initialCheckedState[index] = { checked: true, indicators: metric.indicators.map(() => true) };
      initialWeights[index] = { 
        metricWeight: metric.framework_metric_weight, 
        indicatorWeights: metric.indicators.map(indicator => indicator.indicator_weight)
      }
    });
    setCheckedAccordions(initialCheckedState);
    setWeights(initialWeights);
    setEsgScore("");
  }, [metricDetails]);

  const handleAccordionCheckChange = (accordionIndex, isChecked) => {
    // Update the checked state for the accordion and all its indicators
    const updatedCheckedState = {
      ...checkedAccordions,
      [accordionIndex]: {
        ...checkedAccordions[accordionIndex],
        checked: isChecked,
        indicators: checkedAccordions[accordionIndex].indicators.map(() => isChecked),
      },
    };
    setCheckedAccordions(updatedCheckedState);
  };

  const handleIndicatorCheckChange = (accordionIndex, indicatorIndex, isChecked) => {
    // Update the checked state for a single indicator
    const updatedIndicators = [...checkedAccordions[accordionIndex].indicators];
    updatedIndicators[indicatorIndex] = isChecked;

    // Determine if at least one indicator is checked within the same metric.
    const isAnyIndicatorChecked = updatedIndicators.some(indicator => indicator);

    const updatedCheckedState = {
      ...checkedAccordions,
      [accordionIndex]: {
        checked: isAnyIndicatorChecked,
        indicators: updatedIndicators,
      },
    };
    setCheckedAccordions(updatedCheckedState);
  };

  const handleClickOpen = (type, accordionIndex, indicatorIndex, event) => {
    // Prevent accordion from expanding
    event.stopPropagation(); 
    setWeightType(type);
    setAccordionIndex(accordionIndex);  
    setIndicatorIndex(indicatorIndex);  
    setOpenDialog(true);
  };

  const handleSubmitNewWeight = (weight) => {
    console.log(weightType, accordionIndex, indicatorIndex, weight);
    const newWeights = { ...weights };
    if (weightType === 'metric') {
      newWeights[accordionIndex] = {...newWeights[accordionIndex], metricWeight: weight};
    } else if (weightType === 'indicator') {
      newWeights[accordionIndex] = {
        ...newWeights[accordionIndex],
        indicatorWeights: [...newWeights[accordionIndex].indicatorWeights]
      };
      newWeights[accordionIndex].indicatorWeights[indicatorIndex] = weight;
    }
    setWeights(newWeights);
    console.log(newWeights);
  };

  const handleMetricsSelection = async () => {
    const token = localStorage.getItem('token');
    setErrorMessage('');

    const esgData = metricDetails.map((metric, index) => {
      return {
        framework_metric_name: metric.framework_metric_name,
        framework_metric_weight: weights[index]?.metricWeight,
        indicators: metric.indicators
          .filter((_, indicatorIndex) => checkedAccordions[index].indicators[indicatorIndex])
          .map((indicator, indicatorIndex) => ({
            indicator_name: indicator.indicator_name,
            indicator_weight: weights[index]?.indicatorWeights[indicatorIndex],
            indicator_score_2022: indicator.indicator_score_2022,
            indicator_score_2023: indicator.indicator_score_2023,
          }))
      };
      // Filter out metrics with no selected indicators
    }).filter(metric => metric.indicators.length > 0); 
    console.log("weights:");
    console.log(weights);  
    console.log(esgData);

    try {
      const response = await fetch('http://localhost:12345/company/calculate-esg-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorisation': 'Bearer ' + token,
        },
        body: JSON.stringify({ esg_data: esgData }),
      });
      
      if (response.ok) {
        const responseData = await response.json();
        setEsgScore(responseData.esg_score);
      } else {
        const errorBody = await response.json();
        setErrorMessage(errorBody.message);
      }
    } catch (error) {
      console.error('Error submitting ESG data:', error);
  } 
  };

  return (
    <div>
      <Grid container sx={{ pt: 4, pl: 1, mb: 1, alignItems: 'center' }}>
        <Grid item xs={6.75}>
          <Typography sx={{ fontSize: '1.5rem', fontWeight:'bold' }}>Metrics and Indicators</Typography>
        </Grid>
        <Grid item xs={2.25}>
          <Typography sx={{ fontWeight: 'bold' }}>Weight</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography sx={{ fontWeight: 'bold' }}>2022</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography sx={{ fontWeight: 'bold' }}>2023</Typography>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', 
      flexDirection: 'column', 
      maxHeight: 'calc(100vh - 140px)', 
      overflowY: 'auto', 
      scrollbarWidth: 'none' }}>
        {metricDetails.length > 0 ? (
          <>
          <Box sx={{ flex: '1' }}>
            {metricDetails.map((metric, accordionIndex) => (
              <Accordion key={accordionIndex} sx={{ border: '1px solid #e0e0e0' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container alignItems="center">
                <Grid item xs={1}>
                    <FormControlLabel
                      control={
                      <Checkbox
                        checked={checkedAccordions[accordionIndex]?.checked || false}
                      // Stops accordion from toggling when checkbox is clicked
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => handleAccordionCheckChange(accordionIndex, event.target.checked)}
                      />
                      }
                    />
                  </Grid> 
                  <Grid item xs={6}>
                    <Typography variant="h6">{metric.framework_metric_name}</Typography>
                  </Grid> 
                  <Grid item xs={1}>
                    <Button 
                      variant="contained" 
                      onClick={(event) => handleClickOpen('metric', accordionIndex, null, event)}
                      sx={{ 
                      bgcolor: "#86ad82",
                      borderRadius: "16px",
                      fontWeight: "bold",
                      '&:hover': {
                        backgroundColor: "#779c73",
                      }}}>
                      {weights[accordionIndex]?.metricWeight}</Button>
                  </Grid>
                  </Grid>
              </AccordionSummary>
              <AccordionDetails>
                {metric.indicators.map((indicator, indicatorIndex) => (
                  <Grid key={indicatorIndex} container alignItems="center" spacing={2}>
                    <Grid item xs={1}>
                      <FormControlLabel
                        control={
                          <Checkbox
                          checked={checkedAccordions[accordionIndex]?.indicators[indicatorIndex] || false}
                          onChange={(event) => handleIndicatorCheckChange(accordionIndex, indicatorIndex, event.target.checked)}
                          />
                        }
                      />
                    </Grid>
                    <Grid item xs={5.7}>
                      <Typography>{indicator.indicator_name}</Typography>
                    </Grid>
                    <Grid item xs={2.4} sx={{ borderRight: '1px solid #e0e0e0' }}>
                      <Button 
                        onClick={(event) => handleClickOpen('indicator', accordionIndex, indicatorIndex, event)}
                        variant="contained" 
                        sx={{ 
                        bgcolor: "#98c493",
                        borderRadius: "16px",
                        '&:hover': {
                          backgroundColor: "#8dbd88",
                        }}}>
                        {weights[accordionIndex]?.indicatorWeights[indicatorIndex]}
                      </Button>
                    </Grid>
                    <Grid item xs={1} sx={{ borderRight: '1px solid #e0e0e0' }}>
                      <Typography>{indicator.indicator_score_2022}</Typography>
                    </Grid>
                    <Grid item xs={1} justifyContent="center" alignItems="center">
                      <Typography>{indicator.indicator_score_2023}</Typography>
                    </Grid>
                  </Grid>
                ))}
              </AccordionDetails>
              </Accordion>
              ))}
          </Box>
          <Box sx={{ 
            position: 'sticky', 
            bottom: 0, 
            padding: 2,
            bgcolor: 'white'}}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: "#8eb08b",
                  '&:hover': {
                    backgroundColor: "#779c73",
                  }}}
                onClick={handleMetricsSelection}>
                  Calculate ESG Score
                  </Button>
              </Grid>
              <Grid item xs={4}>
                <Box display="flex" alignItems="center">
                  <Typography variant="h6">Adjusted ESG Score:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold", ml: 1 }}>{esgScore}</Typography>
                </Box>
              </Grid>
            </Grid>
            {errorMessage && (
              <Box 
                sx={{
                  mt: 2,
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#ffdede",
                  borderRadius: "10px",
                  width: "95%"
                }} 
              > <ErrorOutlineIcon sx={{ mr: 1, color: "red" }} />
                <Typography variant="body2">{errorMessage}</Typography>
              </Box>
            )}
          </Box>
          </>
          ) : (
            <Box sx={{ height: '100%', padding: 1, mt: 2 }}>
              <Typography variant="h6">Please choose a framework.</Typography>
            </Box>
          )}
      </Box>
      <ChangeWeightPopup
        open={openDialog}
        setOpenDialog={setOpenDialog}
        handleSubmitNewWeight={(weight) => handleSubmitNewWeight(weight)}
      />
    </div>
  );
};

export default MetricAccordion;