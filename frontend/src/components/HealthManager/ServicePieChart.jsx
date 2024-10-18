// components/ServicePieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ServicePieChart = ({ appointmentData }) => {
  // Prepare data for the pie chart
  const serviceCount = {};

  appointmentData.forEach(appointment => {
    const service = appointment.service;
    if (!serviceCount[service]) {
      serviceCount[service] = 0;
    }
    serviceCount[service]++;
  });

  // Create labels and data arrays
  const labels = Object.keys(serviceCount);
  const data = Object.values(serviceCount);

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };

  return (
    <div className="chart-container" style={{ width: '300px', height: '300px', margin: '0 auto' }}>
      <h3 className="text-center mb-4">Appointments by Service</h3>
      <Pie data={chartData} options={{ maintainAspectRatio: false }} />
    </div>
  );
};

export default ServicePieChart;
