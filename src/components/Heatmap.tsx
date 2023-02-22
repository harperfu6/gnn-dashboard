import { Chart as ChartJS, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
import _ from "underscore";
import {DetaileMiniBatchStatsType} from "../models/MiniBatchData";
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


type HeatmapProps = {
  heatmap2dArray: number[][];
};

const Heatmap: React.FC<HeatmapProps> = ({ heatmap2dArray }) => {
	console.log(heatmap2dArray)
  const array2dataset = (heatmap2dArray: number[][]) => {
    return heatmap2dArray.map((scoreList: number[]) => ({
			data: scoreList.map((_) => 1),
      borderWidth: 1,
      borderColor: "#FFFFFF",
      backgroundColor: "skyblue",
      barPercentage: 0.99,
      categoryPercentage: 0.99,
    }));
  };

  const HeatmapData = {
    labels: generateLabels(),
    datasets: generateDatasets(),
  };
    {/* labels: 'tmp', */}
    {/* datasets: array2dataset(heatmap2dArray), */}

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
