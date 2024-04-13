import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Tooltip, IconButton } from '@mui/material';
import ApexCharts from 'react-apexcharts';
import Topbar from './Topbar';
import CompanyCard from './CompanyCard';
import InfoIcon from '@mui/icons-material/Info';

const Portfolio = () => {
  const [portfolioDetails, setPortfolioDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPortfolioDetails = async () => {
      try {
        const response = await fetch('http://localhost:12345/portfolio/list', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorisation': 'Bearer ' + token,
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data.portfolio);
        setPortfolioDetails(data.portfolio);
      } catch (err) {
        console.error('Error fetching portfolio details:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioDetails();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const totalInvestment = portfolioDetails.reduce((total, item) => total + item.investment_amount
    , 0);
  const weightedAvgESGScore = portfolioDetails.reduce((total, item) => total + (item.investment_amount
    / totalInvestment) * item.esg_rating, 0).toFixed(2);
  const pieSeries = portfolioDetails.map(item => item.investment_amount
  );
  const pieLabels = portfolioDetails.map(item => item.company_name);

  return (
    <div>
      <Topbar />
      <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3, mr: 3, mt: 2 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>My Portfolio</Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Card sx={{ mb: 5 }}>
              <CardContent>
                <ApexCharts
                  type="donut"
                  series={pieSeries}
                  options={{
                    labels: pieLabels,
                    legend: { position: 'bottom' },
                    plotOptions: {
                      pie: {
                        donut: {
                          labels: {
                            show: true,
                            total: {
                              show: true,
                              showAlways: true,
                              label: 'Total Investment',
                              formatter: () => `$${totalInvestment.toLocaleString()}`
                            }
                          }
                        }
                      }
                    },
                    responsive: [{
                      breakpoint: 480,
                      options: { chart: { width: 100 }, legend: { position: 'bottom' } }
                    }]
                  }}
                />
              </CardContent>
            </Card>

            <Card sx={{ mb: 5, position: 'relative'}}>
              <CardContent>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: 2,
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">Average ESG Score</Typography>
                  </Box>
                  <Box sx={{
                    textAlign: 'center',
                    mt: 2
                  }}>
                    <Typography variant="h4" component="span" sx={{ fontWeight: 'bold' }}>{weightedAvgESGScore}</Typography>
                  </Box>
                </Box>

                <Tooltip sx={{ fontSize: '1rem' }} title="The Average ESG Score is calculated by weighting each company's ESG score by its proportion of the total investment amount.">
                  <IconButton sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <InfoIcon />
                  </IconButton>
                </Tooltip>

              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            <Grid container spacing={4}>
              {portfolioDetails.map(companyDetails => (
                <Grid item xs={12} sm={6} md={6} key={companyDetails.id}>
                  <CompanyCard
                    companyDetails={companyDetails}
                    investmentAmount={companyDetails.investment_amount}
                    impactStatement={companyDetails.comment}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Portfolio;
