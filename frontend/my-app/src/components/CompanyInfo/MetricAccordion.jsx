/* handles logic and styling of the metric and indicators accordion */

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, Grid, Checkbox, FormControlLabel, Button, IconButton, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HelpIcon from '@mui/icons-material/Help';
import AddIcon from '@mui/icons-material/Add';
import ChangeWeightPopup from './ChangeWeightPopup';
import AddMetricPopup from './AddMetricPopup';

const MetricAccordion = ({ companyId, selectedFrameworkId }) => {
  const token = localStorage.getItem('token');
  const [metricDetails, setMetricDetails] = useState([]);
  const [checkedAccordions, setCheckedAccordions] = useState({});
  const [esgScore, setEsgScore] = useState("");
  const [openMetricPopup, setOpenMetricPopup] = useState(false);
  const [openWeightPopup, setOpenWeightPopup] = useState(false);
  const [weights, setWeights] = useState({});
  const [weightType, setWeightType] = useState('');
  const [accordionIndex, setAccordionIndex] = useState('');
  const [indicatorIndex, setIndicatorIndex] = useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  // fetch metrics if frameworkId, companyId or token changes
  const fetchMetrics = useCallback(async (additionalMetricIds = []) => {
    let url = `http://localhost:12345/company/esg?company_id=${companyId}&framework_id=${selectedFrameworkId}`;
    if (additionalMetricIds.length > 0) {
      url += `&additional_metrics=${encodeURIComponent(JSON.stringify(additionalMetricIds))}`;
    }
    try {
      const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorisation': 'Bearer ' + token,
      },
    });
      if (response.ok) {
        const responseData = await response.json();
        setMetricDetails(responseData.esg_data);
      } else {
        const errorBody = await response.json();
        console.error(errorBody.message);
      }
    }
    catch (error) {
      console.error('Error fetching esg details:', error);
    }
  }, [companyId, selectedFrameworkId, token]);

  useEffect(() => {
    if (selectedFrameworkId) {
      fetchMetrics(); 
    }
  }, [selectedFrameworkId, fetchMetrics]);

  // when new metrics are added, fetch metrics again.
  const handleAddMetrics = (additionalMetricIds) => {
    fetchMetrics(additionalMetricIds);
  };

  // Initialize the checked state for each accordion based on framework selected
  // change rendering if metricDetails changes
  useEffect(() => {
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

  const handleClickMetricOpen = () => {
    setOpenMetricPopup(true);
  };

  // updates metrics being checked
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

  // updates indicators being checked
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

  // open change weight popup
  const handleClickWeightOpen = (type, accordionIndex, indicatorIndex, event) => {
    // Prevent accordion from expanding
    event.stopPropagation(); 
    setWeightType(type);
    setAccordionIndex(accordionIndex);  
    setIndicatorIndex(indicatorIndex);  
    setOpenWeightPopup(true);
  };

  // when new weight is submitted, change weight of selected metric/indicator to new weight
  const handleSubmitNewWeight = (weight) => {
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
  };

  // calculates new ESG score for the selected metrics and indicators.
  const handleMetricsSelection = async () => {
    setErrorMessage('');

    const esgData = metricDetails.map((metric, metricIndex) => {
      const selectedIndicators = metric.indicators.filter((_, indicatorIndex) => checkedAccordions[metricIndex].indicators[indicatorIndex]);
        return {
          framework_metric_name: metric.framework_metric_name,
          framework_metric_weight: weights[metricIndex]?.metricWeight,
          indicators: selectedIndicators.map(indicator => {
            const originalIndex = metric.indicators.findIndex(ind => ind.indicator_name === indicator.indicator_name);

          return {
              indicator_name: indicator.indicator_name,
              indicator_weight: weights[metricIndex]?.indicatorWeights[originalIndex],
              indicator_score_2022: indicator.indicator_score_2022,
              indicator_score_2023: indicator.indicator_score_2023,
          };
        })
      };
      // Filter out metrics with no selected indicators
    }).filter(metric => metric.indicators.length > 0); 

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

  // balance the metrics weights to all be equal and add up to 1
  const balanceMetricWeights = async () => {
    const selectedMetricNames = metricDetails.filter((_, index) => checkedAccordions[index].checked).map(metric => metric.framework_metric_name);
    const metricsJson = JSON.stringify(selectedMetricNames);
    const encodedMetrics = encodeURIComponent(metricsJson);
    try {
      const response = await fetch(`http://localhost:12345/framework/rebalance-weight?metrics=${encodedMetrics}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorisation': 'Bearer ' + token,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        const newWeight = responseData.weight;

        const newWeights = { ...weights };
        metricDetails.forEach((metric, index) => {
          if (selectedMetricNames.includes(metric.framework_metric_name)) {
            newWeights[index] = {
              ...newWeights[index],
              metricWeight: newWeight, 
            };
          } else {
            newWeights[index] = {
              ...newWeights[index],
              metricWeight: 0, 
            };
          }
        });
        setWeights(newWeights);

      } else {
        const errorBody = await response.json();
        setErrorMessage(errorBody.message);
      }
    } catch (error) {
      console.error('Error submitting ESG data:', error);
    } 
  };

  // styling for metric accordion
  return (
    <div>
      <Grid container sx={{ padding: 3, pb: 1, alignItems: 'center' }}> {/* Adjusted padding */}
        <Grid item xs={3.6}>
          <Typography variant="h4" sx={{ color: '#212529' }}>Metrics and Indicators</Typography> {/* Use variant and ensure color */}
        </Grid>
        <Grid item xs={3.15}>
          {metricDetails.length > 0 && (
            <Tooltip placement="right" title={"Add or remove additional metrics"}>
              <IconButton onClick={handleClickMetricOpen}>
                <AddIcon sx={{color:"#28a745"}}/> {/* Updated AddIcon color */}
              </IconButton>
            </Tooltip>
          )}
        </Grid>
        <Grid item xs={2.25}>
          <Tooltip placement="left" title={"Click on weights to change weighting"}>
            <Typography sx={{ fontWeight: 'bold', color: '#212529' }}>Weight</Typography> {/* Ensure color */}
          </Tooltip>
        </Grid>
        <Grid item xs={1}>
          <Tooltip placement="left" title={"Indicator scores for 2022"}>
            <Typography sx={{ fontWeight: 'bold', color: '#212529' }}>2022</Typography> {/* Ensure color */}
          </Tooltip>
        </Grid>
        <Grid item xs={2}>
          <Tooltip placement="right" title={"Indicator scores for 2023"}>
            <Typography sx={{ fontWeight: 'bold', color: '#212529' }}>2023</Typography> {/* Ensure color */}
          </Tooltip>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', 
      flexDirection: 'column', 
      maxHeight: 'calc(100vh - 145px)', // Keep this calculation if it works for the layout
      overflowY: 'auto', 
      scrollbarWidth: 'none', // Keep for cleaner look
      // borderTop: '1px solid #c7c7c7' // Removed borderTop
      }}>
        {metricDetails.length > 0 ? (
          <>
          <Box sx={{ flex: '1', pl:3, pr:3, pt:1 }}> {/* Added horizontal padding to match header */}
            {metricDetails.map((metric, accordionIndex) => (
              <Accordion
                key={accordionIndex}
                // defaultExpanded // Consider if accordions should be open by default
                sx={{
                  // border: '1px solid #e0e0e0', // Removed border
                  boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)', // Standard card shadow
                  borderRadius: '8px', // Rounded corners
                  mb: 1, // Margin bottom for separation
                  '&:before': { display: 'none' } // Remove default top border/divider of Accordion
                }}
              >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container alignItems="center">
                <Grid item xs={0.75}>
                    <FormControlLabel
                      control={
                      <Checkbox
                        checked={checkedAccordions[accordionIndex]?.checked || false}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => handleAccordionCheckChange(accordionIndex, event.target.checked)}
                        sx={{
                          color: '#6C757D', // Unchecked color
                          '&.Mui-checked': {
                            color: '#28a745', // Checked color
                          },
                        }}
                      />
                      }
                    />
                  </Grid>
                  <Grid item xs={0.55}>
                    <Tooltip 
                      placement="left"
                      title={
                      <React.Fragment>
                        <div>{metric.framework_metric_description}</div>
                      </React.Fragment>
                      }
                    >
                      <HelpIcon sx={{color: "#6C757D", fontSize: "1.25rem" }}/> {/* Updated HelpIcon style */}
                    </Tooltip>
                  </Grid>
                  <Grid item xs={5.65}>
                    <Typography variant="h6" sx={{ color: '#212529' }}>{metric.framework_metric_name}</Typography> {/* Ensure color */}
                  </Grid> 
                  <Grid item xs={1}>
                    <Button 
                      variant="contained" 
                      onClick={(event) => handleClickWeightOpen('metric', accordionIndex, null, event)}
                      sx={{ 
                        bgcolor: '#E9ECEF', // Light gray
                        color: '#212529',   // Primary text
                        borderRadius: '8px', // Updated radius
                        fontWeight: 'normal', // Normal weight
                        padding: '0.25rem 0.5rem', // Adjusted padding
                        textTransform: 'none', // Prevent uppercase
                        '&:hover': {
                          bgcolor: '#CED4DA', // Darker gray on hover
                        }
                      }}>
                      {weights[accordionIndex]?.metricWeight}
                    </Button>
                  </Grid>
                  </Grid>
              </AccordionSummary>
              <AccordionDetails>
                {metric.indicators.map((indicator, indicatorIndex) => (
                  <Grid key={indicatorIndex} container alignItems="center" spacing={2}>
                    <Grid item xs={0.75}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checkedAccordions[accordionIndex]?.indicators[indicatorIndex] || false}
                            onChange={(event) => handleIndicatorCheckChange(accordionIndex, indicatorIndex, event.target.checked)}
                            sx={{
                              color: '#6C757D', // Unchecked color
                              '&.Mui-checked': {
                                color: '#28a745', // Checked color
                              },
                            }}
                          />
                        }
                      />
                    </Grid>
                    <Grid item xs={0.5}>
                    <Tooltip 
                      placement="left"
                      title={
                      <React.Fragment>
                        <div>{indicator.indicator_description}</div>
                        <div>Indicator provided by {indicator.provider_name}</div>
                      </React.Fragment>
                      }
                    >
                      <HelpIcon sx={{color: "#6C757D", fontSize: "1.25rem" }}/> {/* Updated HelpIcon style */}
                    </Tooltip>
                    </Grid> 
                    <Grid item xs={5.4}>
                      <Typography sx={{ color: '#212529' }}>{indicator.indicator_name}</Typography> {/* Ensure color */}
                    </Grid>
                    <Grid item xs={2.4} sx={{ borderRight: '1px solid #e0e0e0' }}>
                      <Button 
                        onClick={(event) => handleClickWeightOpen('indicator', accordionIndex, indicatorIndex, event)}
                        variant="contained" 
                        sx={{ 
                          bgcolor: '#E9ECEF', // Light gray
                          color: '#212529',   // Primary text
                          borderRadius: '8px', // Updated radius
                          fontWeight: 'normal', // Normal weight
                          padding: '0.25rem 0.5rem', // Adjusted padding
                          textTransform: 'none', // Prevent uppercase
                          '&:hover': {
                            bgcolor: '#CED4DA', // Darker gray on hover
                          }
                        }}>
                        {weights[accordionIndex]?.indicatorWeights[indicatorIndex]}
                      </Button>
                    </Grid>
                    <Grid item xs={1} sx={{ borderRight: '1px solid #e0e0e0' }}>
                      <Typography sx={{ color: '#212529' }}>{indicator.indicator_score_2022}</Typography> {/* Ensure color */}
                    </Grid>
                    <Grid item xs={1} justifyContent="center" alignItems="center">
                      <Typography sx={{ color: '#212529' }}>{indicator.indicator_score_2023}</Typography> {/* Ensure color */}
                    </Grid>
                  </Grid>
                ))}
              </AccordionDetails>
              </Accordion>
              ))}
          </Box>
          {/* Sticky Footer */}
          <Box sx={{ 
            position: 'sticky', 
            bottom: 0, 
            padding: 2, // Ensure padding is appropriate
            bgcolor: 'white',
            borderTop: '1px solid #DEE2E6', // Standard divider color
            zIndex: 1 // Ensure it's above scrolling content
            }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={7.5}> {/* Adjusted grid for responsiveness */}
                <Button 
                  variant="contained"
                  sx={{
                    mr: { xs: 0, sm: 2 }, // Margin right, responsive
                    mb: { xs: 1, sm: 0 }, // Margin bottom for stacked buttons on xs screens
                    width: { xs: '100%', sm: 'auto' }, // Full width on xs
                    backgroundColor: '#28a745',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    '&:hover': {
                      backgroundColor: '#218838',
                    }
                  }}
                  onClick={handleMetricsSelection}>
                  Calculate ESG Score
                </Button>
                <Button 
                  variant="contained" 
                  sx={{ 
                    width: { xs: '100%', sm: 'auto' }, // Full width on xs
                    backgroundColor: '#28a745',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    '&:hover': {
                      backgroundColor: '#218838',
                    }
                  }}
                  onClick={balanceMetricWeights}>
                  Balance Metric Weights
                </Button>
              </Grid>
              <Grid item xs={12} sm={4.5}> {/* Adjusted grid for responsiveness */}
                  <Box display="flex" alignItems="center" justifyContent={{xs: 'flex-start', sm: 'flex-end'}}>
                    <Tooltip title={"weighted score = indicator ESG score * framework metric weight * indicator weight. All the weighted scores for the indicator are averaged. The final ESG score is the sum of all averaged weighted scores."}>
                      <HelpIcon sx={{ mr: 1, fontSize: "1.25rem", color: '#6C757D' }}/> {/* Updated HelpIcon */}
                    </Tooltip>
                    <Typography variant="h6" sx={{ color: '#212529' }}>Adjusted ESG Score:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold", ml: 1, color: '#212529' }}>{esgScore}</Typography>
                  </Box>
              </Grid>
            </Grid>
            {errorMessage && (
              <Box 
                sx={{
                  mt: 2,
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#f8d7da', // Error background
                  color: '#721c24', // Error text color
                  borderRadius: '8px', // Rounded corners
                  border: '1px solid #f5c6cb', // Error border
                  // width: "95%" // Consider full width or adjust as needed
                }} 
              >
                <ErrorOutlineIcon sx={{ mr: 1, color: '#721c24' }} /> {/* Error icon color */}
                <Typography variant="body2">{errorMessage}.</Typography>
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
        open={openWeightPopup}
        setOpenWeightPopup={setOpenWeightPopup}
        handleSubmitNewWeight={(weight) => handleSubmitNewWeight(weight)}
      />
      <AddMetricPopup
        open={openMetricPopup}
        setOpenMetricPopup={setOpenMetricPopup}
        frameworkId={selectedFrameworkId}
        onAddMetrics={handleAddMetrics}
      />
    </div>
  );
};

export default MetricAccordion;