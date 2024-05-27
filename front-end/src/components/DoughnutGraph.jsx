import { Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function DoughnutGraph({showLegend}) {
  let doughnutLabels = [
    "Category 1",
    "Category 2",
    "Category 3",
    "Category 4",
    "Category 5",
  ];

  let doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      datalabels: {
        display: false,
      },
      legend: {
        display: showLegend,
        position: 'bottom',
      },
    },
  };

  let doughnutData = {
    labels: doughnutLabels,
    datasets: [
      {
        label: "Categories",
        data: ["12", "32", "63", "34", "40"],
        backgroundColor: ["red", "blue", "green", "pink", "yellow"],
      },
    ],
  };

  return <Doughnut options={doughnutOptions} data={doughnutData} />;
}

export default DoughnutGraph;
