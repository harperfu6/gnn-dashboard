import styles from "../styles/Home.module.css";

import useSWR from "swr";

import { AllMiniBatchStats } from "../models/minibatchStats";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { Grid, Navbar, Spacer } from "@nextui-org/react";
ChartJS.register(...registerables);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const makeLossList = (data: AllMiniBatchStats[]) => {
  return data.map((mbd: AllMiniBatchStats) => mbd.loss);
};

const makeAucList = (data: AllMiniBatchStats[]) => {
  return data.map((mbd: AllMiniBatchStats) => mbd.auc);
};

const appendDict = (
  dict1: { [key: string]: number },
  dict2: { [key: string]: number }
) => {
  Object.entries(dict2).forEach(([key, value]) => {
    if (dict1[key]) {
      dict1[key] = dict1[key] + value;
    } else {
      dict1[key] = value;
    }
  });

  return dict1;
};

const makePosSampledNumDict = (data: AllMiniBatchStats[]) => {
  return data.reduce(
    (acc: { [node: string]: number }, current: AllMiniBatchStats) =>
      appendDict(acc, current.sampled_num["pos"]),
    {}
  );
};

const makeLineData = (dataList: number[], label: string) => {
  return {
    labels: Array.from({ length: dataList.length }, (_, i) => i),
    datasets: [
      {
        label: label,
        data: dataList,
      },
    ],
  };
};

const getNtypeList = (sampledNumDict: { [node: string]: number }) => {
  return Array.from(
    new Set(Object.keys(sampledNumDict).map((key) => key.split("_")[0]))
  );
};

const makeBarDataByNtype = (
  sampledNumDict: { [node: string]: number },
  ntype: string,
  topk: number = 20
) => {
  const ntypeDataList = Object.entries(sampledNumDict).filter(
    ([key, _]) => key.split("_")[0] == ntype
  );
  const sortedNtypeDataList = ntypeDataList.sort(
    (a: [string, number], b: [string, number]) => b[1] - a[1]
  );
  const labels = sortedNtypeDataList
    .map((ntypeData: [string, number]) => ntypeData[0])
    .slice(0, topk);
  const data = ntypeDataList
    .map((ntypeData: [string, number]) => ntypeData[1])
    .slice(0, topk);
  return {
    labels: labels,
    datasets: [
      {
        label: "sampled num",
        data: data,
      },
    ],
  };
};

const AllMiniBatchStats: React.FC = () => {
  const { data: allMiniBatchStatsList, error } = useSWR(
    `/api/minibatch_stats/`,
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (!allMiniBatchStatsList) return <div>loading...</div>;

  const lossList: number[] = makeLossList(allMiniBatchStatsList);
  const aucList: number[] = makeAucList(allMiniBatchStatsList);
  const posSampledNumDict: { [node: string]: number } = makePosSampledNumDict(
    allMiniBatchStatsList
  );
  const ntypeList = getNtypeList(posSampledNumDict);

  const lossOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
        text: "loss",
      },
    },
  };

  const aucOptions = {
    responsive: true,
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 1.0,
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
        text: "loss",
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
        text: "sampled num",
      },
    },
  };

  const lossData = makeLineData(lossList, "loss");
  const aucData = makeLineData(aucList, "auc");

  return (
    <>
      <Grid.Container>
        <Grid xs={6}>
          <Line options={lossOptions} data={lossData} />
        </Grid>
        <Grid xs={6}>
          <Line options={aucOptions} data={aucData} />
        </Grid>
      </Grid.Container>
      <Spacer y={3} />
      <Grid.Container>
        {ntypeList &&
          ntypeList.map((ntype: string) => {
            const data = makeBarDataByNtype(posSampledNumDict, ntype);
            const vwh = 100 / ntypeList.length;
            return (
              <Grid key={ntype} css={{ w: `${vwh}vw`, h: `${vwh * 1.5}vw` }}>
                <Bar options={barOptions} data={data} />
              </Grid>
            );
          })}
      </Grid.Container>
    </>
  );
};

const Home = () => {
  return (
    <>
      <Navbar variant="sticky">
        <Navbar.Content>
          <Navbar.Link href="#">Home</Navbar.Link>
          <Navbar.Link href="#">MiniBatch</Navbar.Link>
        </Navbar.Content>
      </Navbar>
      <AllMiniBatchStats />
    </>
  );
};

{
  /* <Link href="/graph/1/0">Go</Link> */
}

export default Home;
