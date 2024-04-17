import React from 'react';
import ApexCharts from 'react-apexcharts';

const InvestmentPieChart = ({ portfolioDetails }) => {
  const pieSeries = portfolioDetails.map(item => item.investment_amount);
  const pieLabels = portfolioDetails.map(item => item.company_name);
  const options = {
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
            }
          }
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: { chart: { width: 100 }, legend: { position: 'bottom' } }
    }]
  };

  return (
    <ApexCharts type="donut" series={pieSeries} options={options} height={370} />
  );
};

export default InvestmentPieChart;
