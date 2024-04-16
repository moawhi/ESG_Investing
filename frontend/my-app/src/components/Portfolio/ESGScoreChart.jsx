import React from 'react';
import ApexCharts from 'react-apexcharts';

const ESGScoresChart = ({ companyDetails, weightedAvgESGScore }) => {
  const options = {
    chart: {
      type: 'bar',
      height: 200
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
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
    },
    yaxis: {
      title: {
        text: 'ESG Scores'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " points";
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40
    },
    annotations: {
      yaxis: [
        {
          y: weightedAvgESGScore,
          borderColor: '#f00',
          label: {
            borderColor: '#f00',
            style: {
              color: '#fff',
              background: '#f00',
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
