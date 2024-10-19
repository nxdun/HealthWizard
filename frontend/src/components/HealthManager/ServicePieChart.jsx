import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ServicePieChart = ({ appointmentData = [] }) => { // Default to empty array
    // Check if appointmentData is not an array or is empty
    if (!Array.isArray(appointmentData) || appointmentData.length === 0) {
        return <p>No appointment data available.</p>;
    }

    const serviceCount = {};

    appointmentData.forEach(appointment => {
        const service = appointment.service;
        if (!serviceCount[service]) {
            serviceCount[service] = 0;
        }
        serviceCount[service]++;
    });

    const labels = Object.keys(serviceCount);
    const data = Object.values(serviceCount);

    const chartData = {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
        ],
    };

    return (
        <div className="chart-container" style={{ width: '500px', height: '500px', margin: '0 auto' }}>
            <h3 className="text-center mb-4 text-xl font-semibold">Appointments by Service</h3>
            <Pie data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
    );
};

export default ServicePieChart;
