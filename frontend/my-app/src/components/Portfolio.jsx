import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import ApexCharts from 'react-apexcharts';
import Topbar from './Topbar';
import CompanyCard from './CompanyCard';

// Dummy data for portfolio details
const portfolioDetails = [
  {
    id: 1,
    companyName: 'GreenTech Innovations',
    investmentAmount: 5000,
    esgScore: 85,
    impactStatement: 'Leading in renewable energy solutions.',
  },
  {
    id: 2,
    companyName: 'FairTrade Goods Co.',
    investmentAmount: 3000,
    esgScore: 75,
    impactStatement: 'Supporting ethical trading practices.',
  },
  {
    id: 3,
    companyName: 'Eco Homes',
    investmentAmount: 7000,
    esgScore: 92,
    impactStatement: 'Building sustainable and energy-efficient homes.',
  },
  {
    id: 4,
    companyName: 'Eco Homes',
    investmentAmount: 7000,
    esgScore: 92,
    impactStatement: 'Building sustainable and energy-efficient homes.',
  },
];

// Calculating total investment for the portfolio
const totalInvestment = portfolioDetails.reduce((total, item) => total + item.investmentAmount, 0);

// Calculating weighted average ESG score
const weightedAvgESGScore = portfolioDetails.reduce((total, item) => total + (item.investmentAmount / totalInvestment) * item.esgScore, 0).toFixed(2);

// Preparing data for the donut chart
const pieSeries = portfolioDetails.map(item => item.investmentAmount);
const pieLabels = portfolioDetails.map(item => item.companyName);

const Portfolio = () => {
  return (
    <div>
      <Topbar />
      <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3, mr: 3, mt: 2 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>My Portfolio</Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>

            <Card sx={{ mb: 4 }}>
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

            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6">Average ESG Score</Typography>
                <Typography>{`Based on investment amount: ${weightedAvgESGScore}`}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {portfolioDetails.map(companyDetails => (
                <Grid item xs={12} sm={6} md={4} key={companyDetails.id}>
                  <CompanyCard
                    companyDetails={companyDetails}
                    investmentAmount={companyDetails.investmentAmount}
                    impactStatement={companyDetails.impactStatement}
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
