import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const LineGraph = () => {
  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [
      {
        label: "Sales Per Week",
        data: [],
        borderRadius: 10,
        tension: 0.5,
        borderColor: "pink", // Set the color of the line
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/getsaleschart");
        const salesData = response.data;
    
        // Process the fetched data to extract labels (day names) and sales amounts
        const labels = salesData.map((sale) => {
          const saleDate = new Date(sale.date);
          const dayName = saleDate.toLocaleString('en-US', { weekday: 'long' }); // Get the full name of the day
          const date = saleDate.getDate(); // Get the day of the month
          return `${dayName}-${date}`;
        });
        const salesAmounts = salesData.map((sale) => sale.sale_amount);
    
        // Update the lineData object with the fetched data
        setLineData((prevLineData) => ({
          ...prevLineData,
          labels: labels,
          datasets: [
            {
              ...prevLineData.datasets[0],
              data: salesAmounts,
            },
          ],
        }));
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    

    fetchData();
  }, []);

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Sales Per Week",
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Days',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Sales',
        },
      },
    },
  };

  return <Line options={options} data={lineData} />;
};
