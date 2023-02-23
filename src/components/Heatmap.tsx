import { Chart as ChartJS, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
import _ from "underscore";
import { DetaileMiniBatchStatsType } from "../models/MiniBatchData";
import { maxValueof2dArray } from "../utils";
ChartJS.register(...registerables);


const _generateLabels = (heatmap2dArray: number[][]) => {
  let labels = [];
  for (var i = 1; i < heatmap2dArray[0].length + 1; i++) {
    labels.push(i);
  }
  return labels;
};

type HeatmapProps = {
  heatmap2dArray: number[][];
};

const Heatmap: React.FC<HeatmapProps> = ({ heatmap2dArray }) => {
  console.log(heatmap2dArray);

  const maxCount = maxValueof2dArray(heatmap2dArray);

  const countList2color = (countList: number[]) => {
    const count2opa = (count: number) => (count / maxCount).toFixed(2);
    return countList.map(
      (count: number) => `rgba(135,206,235,${count2opa(count)})`
    );
  };

  const array2dataset = (heatmap2dArray: number[][]) => {
    return heatmap2dArray.map((countList: number[]) => ({
      data: countList.map((_) => 0.1),
      borderWidth: 1,
      borderColor: "#FFFFFF",
      backgroundColor: countList2color(countList),
      barPercentage: 0.99,
      categoryPercentage: 0.99,
    }));
  };

  const HeatmapData = {
    labels: _generateLabels(heatmap2dArray),
    datasets: array2dataset(heatmap2dArray),
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
          stepSize: 0.1,
          display: true,
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
