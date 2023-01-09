import styles from "../styles/Home.module.css";

import useSWR from "swr";

import { AllMiniBatchStats } from "../models/minibatchStats";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { Grid, Spacer, Text } from "@nextui-org/react";
import MyNavbar from "../components/Nav";
import { getEpochSampleIdList } from "../utils";
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

const makeSampledNumDict = (data: AllMiniBatchStats[], posNeg: string) => {
  return data.reduce(
    (acc: { [node: string]: number }, current: AllMiniBatchStats) =>
      appendDict(acc, current.sampled_num[posNeg]),
    {}
  );
};

const makeLineData = (
  dataList: number[],
  label: string,
  epochIdList: number[],
  sampleIdList: number[]
) => {
  const epochIdListLength = epochIdList.length;
  const sampleIdListLength = sampleIdList.length;
  const labelList = Array.from(
    { length: epochIdListLength * sampleIdListLength },
    (_, i) =>
      `epoch-${Math.floor(i / sampleIdListLength) + 1}/sample-${
        i % sampleIdListLength
      }`
  );
  console.log(labelList);
  return {
    labels: labelList,
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

  const { epochIdList, sampleIdList } = getEpochSampleIdList(
    allMiniBatchStatsList
  );

  const lossList: number[] = makeLossList(allMiniBatchStatsList);
  const aucList: number[] = makeAucList(allMiniBatchStatsList);
  const posSampledNumDict: { [node: string]: number } = makeSampledNumDict(
    allMiniBatchStatsList,
    "pos"
  );
  const negSampledNumDict: { [node: string]: number } = makeSampledNumDict(
    allMiniBatchStatsList,
    "neg"
  );
  const ntypeList = getNtypeList(posSampledNumDict);

  const lossOptions = {
    responsive: true,
    scales: {
      x: {
        display: false,
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

  const aucOptions = {
    responsive: true,
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 1.0,
      },
      x: {
        display: false,
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
        text: "auc",
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

  const lossData = makeLineData(lossList, "loss", epochIdList, sampleIdList);
  const aucData = makeLineData(aucList, "auc", epochIdList, sampleIdList);

  return (
    <>
      <Grid.Container justify="center">
        <Grid xs={5} justify="center">
          <Line options={lossOptions} data={lossData} />
        </Grid>
        <Spacer x={5} />
        <Grid xs={5} justify="center">
          <Line options={aucOptions} data={aucData} />
        </Grid>
      </Grid.Container>
      <Spacer y={3} />
      <Grid.Container>
        <Grid xs={6}>
          <Grid.Container justify="center">
            <Grid xs={12} justify="center">
              <Text>positive</Text>
            </Grid>
            {ntypeList &&
              ntypeList.map((ntype: string) => {
                const data = makeBarDataByNtype(posSampledNumDict, ntype);
                const vw = Math.floor(100 / ntypeList.length);
                return (
                  <Grid
                    key={ntype}
                    css={{ w: `${vw}vw`, h: `${vw * 1.5}vw` }}
                  >
                    <Bar options={barOptions} data={data} />
                  </Grid>
                );
              })}
          </Grid.Container>
        </Grid>
        <Grid xs={6}>
          <Grid.Container justify="center">
            <Grid xs={12} justify="center">
              <Text>negative</Text>
            </Grid>
            {ntypeList &&
              ntypeList.map((ntype: string) => {
                const data = makeBarDataByNtype(negSampledNumDict, ntype);
                const vw = Math.floor(100 / ntypeList.length);
                return (
                  <Grid key={ntype} css={{ w: `${vw}vw`, h: `${vw * 1.5}vw` }}>
                    <Bar options={barOptions} data={data} />
                  </Grid>
                );
              })}
          </Grid.Container>
        </Grid>
      </Grid.Container>
    </>
  );
};

const Home = () => {
  return (
    <>
      <MyNavbar />
      <AllMiniBatchStats />
    </>
  );
};

export default Home;
