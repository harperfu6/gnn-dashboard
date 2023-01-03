import { Grid } from "@nextui-org/react";
import { useRouter } from "next/router";
import { Chart as ChartJS, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
import useSWR from "swr";
import { MiniBatchStats } from "../../../models/minibatchStats";
ChartJS.register(...registerables);

const binnig = (
  num_list: number[],
  min: number,
  max: number,
  interval: number
) => {
  const arrayLength = Math.round((max - min) / interval);
  let binnigList = Array.from({ length: arrayLength }, () => 0);
  const binnigRangeList = [...Array(arrayLength)].map(
    (_, i) => min + i * interval
  );

  num_list.forEach((num, n_i) => {
    binnigRangeList.forEach((binRange, r_i) => {
      if (num >= binnigRangeList[r_i + 1]) {
        binnigList[r_i + 1] = binnigList[r_i + 1] + 1;
      } else if (
        num >= binnigRangeList[r_i] &&
        num < binnigRangeList[r_i + 1]
      ) {
        binnigList[r_i] = binnigList[r_i] + 1;
      }
    });
  });

  return [binnigList, binnigRangeList];
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const MiniBatchStats = () => {
  const router = useRouter();
  const { epochId, sampleId } = router.query;

  const { data, error } = useSWR(
    epochId ? `/api/minibatch_stats/${epochId}/${sampleId}` : null,
    fetcher
  );
  const miniBatchStats: MiniBatchStats = data;

  if (error) return <div>Failed to load</div>;
  if (!miniBatchStats) return <div>Loading...</div>;

  const loss = miniBatchStats.loss;
  const auc = miniBatchStats.auc;

  const etype_list = Object.keys(miniBatchStats.pos_score);
  const [posScoreBinnigList, binnigRangeList] = binnig(
    miniBatchStats.pos_score[etype_list[0]],
    0,
    1,
    0.1
  );
  const [negScoreBinnigList, _] = binnig(
    miniBatchStats.neg_score[etype_list[0]],
    0,
    1,
    0.1
  );

  // Bar settings
  const charts_options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "score count",
      },
    },
  };

  const charts_data = {
    labels: binnigRangeList.map((r) => r.toFixed(1)),
    datasets: [
      {
        label: "positive",
        data: posScoreBinnigList,
      },
      {
        label: "negative",
        data: negScoreBinnigList,
      },
    ],
  };

  return (
    <>
      <Grid.Container>
        <Grid>
          <Bar options={charts_options} data={charts_data} />
        </Grid>
        <Grid>
          <div>Loss: {loss}</div>
          <div>AUC: {auc}</div>
        </Grid>
      </Grid.Container>
    </>
  );
};

export default MiniBatchStats;
