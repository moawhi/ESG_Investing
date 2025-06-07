import React from 'react';
import ApexCharts from 'react-apexcharts';

/**
 * Bar chart component, showing ESG scores and rating.
 * @param {companyDetails, weightedAvgESGScore}
 * @returns 
 */
const ESGScoresChart = ({ companyDetails, weightedAvgESGScore }) => {
  const options = {
    chart: {
      type: 'bar',
      height: 200,
      fontFamily: 'Inter, sans-serif' // General font
    },
    colors: ['#28a745', '#007BFF', '#17a2b8', '#ffc107', '#6f42c1'], // Colors for series
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '20%', // Consider adjusting if too narrow for many companies
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent']
    },
    xaxis: {
      categories: companyDetails.map(company => company.company_name),
      labels: {
        style: {
          colors: '#6C757D', // Secondary text color for x-axis labels
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    yaxis: {
      title: {
        text: 'ESG Scores',
        style: {
          color: '#212529', // Primary text color for y-axis title
          fontFamily: 'Inter, sans-serif'
        }
      },
      labels: {
        style: {
          colors: '#6C757D', // Secondary text color for y-axis labels
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      style: {
        fontFamily: 'Inter, sans-serif'
      },
      theme: 'dark', // Dark theme for tooltip
      y: {
        formatter: function (val) {
          return val + " points";
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40,
      fontFamily: 'Inter, sans-serif',
      labels: {
        colors: '#212529' // Primary text color for legend labels
      }
    },
    annotations: {
      yaxis: [
        {
          y: weightedAvgESGScore,
          borderColor: '#28a745', // New green accent
          label: {
            borderColor: '#28a745', // New green accent
            style: {
              color: '#fff', // White text
              background: '#28a745', // New green accent background
              fontFamily: 'Inter, sans-serif'
            },
            text: 'Avg ESG Score'
          },
          tooltip: {
            enabled: true,
            formatter: function (val) {
              return "Weighted Avg ESG Score: " + val;
            }
          }
        }
      ]
    }
  };

  const series = [
    {
      name: 'ESG Rating',
      data: companyDetails.map(company => company.esg_rating)
    },
    {
      name: 'GRI',
      data: companyDetails.map(company => company.esg_score_GRI)
    },
    {
      name: 'ISSB',
      data: companyDetails.map(company => company.esg_score_ISSB)
    },
    {
      name: 'SASB',
      data: companyDetails.map(company => company.esg_score_SASB)
    },
    {
      name: 'TCFD',
      data: companyDetails.map(company => company.esg_score_TCFD)
    }
  ];

  return (
    <div id="chart">
      <ApexCharts options={options} series={series} type="bar" height={320} />
    </div>
  );
};

export default ESGScoresChart;
