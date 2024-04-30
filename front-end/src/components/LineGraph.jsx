import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const lineData = {
  labels: [
    "Monday",
    "Tuesday",
    "Wedenesday",
    "Monday",
    "Tuesday",
    "Wedenesday",
  ],
  datasets: [
    {
      label: "Sales Per Week",
      data: [3000, 8876, 5678, 7666, 7890, 9999],
      borderColor: "red",
      backgroundColor: "white",
      borderRadius: 10,
    },
  ],
};
export const LineGraph = () => {
  const options = {};

  return <Line options={options} data={lineData} />;
};
