import { Chart as ChartJS, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(...registerables);

const mapHeight = 20;
const mapWidth = 40;

const generateDatasets = function () {
  const datasets = [];
  for (let i = 0; i < mapHeight; i++) {
    datasets.push({
      data: new Array(mapWidth).fill(1),
      borderWidth: 1,
      borderColor: "#FFFFFF",
      backgroundColor: "skyblue",
      barPercentage: 0.99,
      categoryPercentage: 0.99,
    });
  }
  return datasets;
};
const generateLabels = function () {
  let labels = [];
  for (var i = 1; i < mapWidth + 1; i++) {
    labels.push(i);
  }
  return labels;
};

type HeatmapProps = {};

const Heatmap: React.FC<HeatmapProps> = () => {
  const HeatmapData = {
    labels: generateLabels(),
    datasets: generateDatasets(),
  };

  const HeatmapOptions = {
    plugins: {
      title: {
        display: true,
        text: "Heat Map Sample",
        fontSize: 18,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: "#FFFFFF",
        },
        stacked: true,
        ticks: {
          min: 0,
          display: false,
        },
      },
      y: {
        grid: {
          color: "#FFFFFF",
          zeroLineWidth: 0,
        },
        stacked: true,
        ticks: {
          min: 0,
          stepSize: 1,
          display: false,
        },
      },
    },
  };
  return (
    <>
      <Bar options={HeatmapOptions} data={HeatmapData}></Bar>
    </>
  );
};

export default Heatmap;
