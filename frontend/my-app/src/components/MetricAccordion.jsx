import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Grid, Checkbox, FormControlLabel, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MetricAccordion = ({ metricDetails }) => {
  const [checkedAccordions, setCheckedAccordions] = useState({});
  const [esgScore, setEsgScore] = useState("");

  useEffect(() => {
    // Initialize the checked state for each accordion based on metricDetails being checked
    const initialCheckedState = {};
    metricDetails.forEach((metric, index) => {
      initialCheckedState[index] = { checked: false, indicators: metric.indicators.map(() => false) };
    });
    setCheckedAccordions(initialCheckedState);
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

  const handleMetricsSelection = async () => {
    const token = localStorage.getItem('token');

    const esgData = metricDetails.map((metric, index) => {
      return {
        framework_metric_name: metric.framework_metric_name,
        framework_metric_weight: metric.framework_metric_weight,
        indicators: metric.indicators
          .filter((_, indicatorIndex) => checkedAccordions[index].indicators[indicatorIndex])
          .map(indicator => ({
            indicator_name: indicator.indicator_name,
            indicator_weight: indicator.indicator_weight,
            indicator_score_2022: indicator.indicator_score_2022,
            indicator_score_2023: indicator.indicator_score_2023,
          }))
      };
      // Filter out metrics with no selected indicators
    }).filter(metric => metric.indicators.length > 0); 
    
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
        console.log(responseData);
      } else {
        const errorBody = await response.json();
        console.error(errorBody.message);
      }
    } catch (error) {
      console.error('Error submitting ESG data:', error);
  } 
  };

  return (
    <div>
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
            <Grid item xs={6.25}>
              <Typography variant="h6">{metric.framework_metric_name}</Typography>
            </Grid> 
            <Grid item xs={1}>
              <Typography variant="h6">{metric.framework_metric_weight}</Typography>
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
              <Grid item xs={6} sx={{ borderRight: '1px solid #e0e0e0' }}>
                <Typography>{indicator.indicator_name}</Typography>
              </Grid>
              <Grid item xs={2} sx={{ borderRight: '1px solid #e0e0e0' }}>
                <Typography>{indicator.indicator_weight}</Typography>
              </Grid>
              <Grid item xs={1} sx={{ borderRight: '1px solid #e0e0e0' }}>
                <Typography>{indicator.indicator_score_2022}</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography>{indicator.indicator_score_2023}</Typography>
              </Grid>
            </Grid>
          ))}
        </AccordionDetails>
        </Accordion>
        ))}
        <Button onClick={handleMetricsSelection}>Calculate ESG Score</Button>
        <Typography>{esgScore}</Typography>
    </div>
  );
};

export default MetricAccordion;