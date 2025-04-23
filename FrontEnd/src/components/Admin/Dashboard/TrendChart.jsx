import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TrendChart = ({ chartData, reportType }) => {
  if (!chartData || chartData.length === 0) {
    return <div className="text-gray-500">No data available for the selected period</div>;
  }

  // Determine chart options based on report type
  const getChartOptions = () => {
    const commonOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    };

    switch (reportType) {
      case 'bookings':
        return {
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            title: {
              display: true,
              text: 'Monthly Bookings Trend',
            },
          }
        };
      case 'revenue':
        return {
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            title: {
              display: true,
              text: 'Monthly Revenue Trend',
            },
          }
        };
      case 'users':
        return {
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            title: {
              display: true,
              text: 'Monthly User Growth',
            },
          }
        };
      case 'properties':
        return {
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            title: {
              display: true,
              text: 'Monthly Property Listings',
            },
          }
        };
      default:
        return commonOptions;
    }
  };

  // Prepare chart data based on report type
  const getChartDataset = () => {
    const labels = chartData.map(item => item.month);
    
    switch (reportType) {
      case 'bookings':
        return {
          labels,
          datasets: [
            {
              label: 'Bookings',
              data: chartData.map(item => item.bookings),
              borderColor: 'rgb(99, 102, 241)', // purple
              backgroundColor: 'rgba(99, 102, 241, 0.5)',
              tension: 0.1
            },
            {
              label: 'Revenue',
              data: chartData.map(item => item.revenue),
              borderColor: 'rgb(16, 185, 129)', // green
              backgroundColor: 'rgba(16, 185, 129, 0.5)',
              tension: 0.1,
              hidden: true
            }
          ]
        };
      case 'revenue':
        return {
          labels,
          datasets: [
            {
              label: 'Revenue',
              data: chartData.map(item => item.revenue),
              borderColor: 'rgb(16, 185, 129)', // green
              backgroundColor: 'rgba(16, 185, 129, 0.5)',
              tension: 0.1
            }
          ]
        };
      case 'users':
        return {
          labels,
          datasets: [
            {
              label: 'New Users',
              data: chartData.map(item => item.users),
              borderColor: 'rgb(59, 130, 246)', // blue
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              tension: 0.1
            }
          ]
        };
      case 'properties':
        return {
          labels,
          datasets: [
            {
              label: 'New Properties',
              data: chartData.map(item => item.properties),
              borderColor: 'rgb(245, 158, 11)', // yellow
              backgroundColor: 'rgba(245, 158, 11, 0.5)',
              tension: 0.1
            }
          ]
        };
      default:
        return { labels: [], datasets: [] };
    }
  };

  return (
    <div className="h-full w-full">
      <Line 
        options={getChartOptions()} 
        data={getChartDataset()} 
      />
    </div>
  );
};

export default TrendChart;