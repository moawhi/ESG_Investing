import React from 'react';
import ApexCharts from 'react-apexcharts';

/**
 * Donut chart showing portfolio composition and total investment
 * @param {portfolioDetails} param0 
 * @returns 
 */
const InvestmentPieChart = ({ portfolioDetails }) => {
  const pieSeries = portfolioDetails.map(item => item.investment_amount);
  const pieLabels = portfolioDetails.map(item => item.company_name);
  const options = {
    chart: {
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#28a745', '#007BFF', '#17a2b8', '#ffc107', '#6f42c1', '#fd7e14', '#20c997'],
    labels: pieLabels,
    legend: {
      position: 'bottom',
      fontFamily: 'Inter, sans-serif',
      labels: {
        colors: '#212529'
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: 'Total Investment',
              color: '#212529',
              fontFamily: 'Inter, sans-serif'
              // ApexCharts might automatically style the value based on this or might need a specific 'value' style property if available
            }
          }
        }
      }
    },
    tooltip: {
      style: {
        fontFamily: 'Inter, sans-serif'
      }
    },
    responsive: [{
      breakpoint: 480,
      options: { chart: { width: 100 }, legend: { position: 'bottom' } } // Keep responsive options
    }]
  };

  return (
    <ApexCharts type="donut" series={pieSeries} options={options} height={370} />
  );
};

export default InvestmentPieChart;
