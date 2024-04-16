import React from 'react';
import ApexCharts from 'react-apexcharts';

const InvestmentPieChart = ({ pieSeries, pieLabels }) => {
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
              formatter: function () {
                const totalInvestment = pieSeries.reduce((acc, val) => acc + val, 0);
                return `$${totalInvestment.toLocaleString()}`;
              }
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
