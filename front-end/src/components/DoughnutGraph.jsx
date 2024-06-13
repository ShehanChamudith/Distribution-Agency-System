import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // Register the plugin
);

function DoughnutGraph({ showLegend }) {
  const [doughnutData, setDoughnutData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Total Stock',
        data: [],
        backgroundColor: ['red', 'blue', 'green', 'pink', 'yellow'],
      },
    ],
  });

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/getproductchart'); // Replace with your actual endpoint
        const products = response.data;

        const labels = products.map(product => product.product_name);
        const data = products.map(product => product.stock_total);

        setDoughnutData({
          labels,
          datasets: [
            {
              label: 'Total Stock',
              data,
              backgroundColor: ['red', 'blue', 'green', 'pink', 'yellow', 'orange', 'purple', 'cyan', 'magenta', 'lime', 'brown', 'gray'],
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductData();
  }, []);

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      datalabels: {
        display: false,
        color: 'black', // Set the label color
        formatter: (value, context) => {
          // Show label only if value is greater than 10
          return value > 50 ? context.chart.data.labels[context.dataIndex] : '';
        },
      },
      legend: {
        display: false,
        position: 'bottom',
        align: 'center',
        labels: {
          boxWidth: 15,
          usePointStyle: false,
        },
      },
    },
  };

  return <Doughnut options={doughnutOptions} data={doughnutData} />;
}

export default DoughnutGraph;
