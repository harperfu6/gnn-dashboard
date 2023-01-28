import styles from "../styles/Home.module.css";

import useSWR from "swr";

import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { Grid, Spacer } from "@nextui-org/react";
import MyNavbar from "../components/Nav";
import { fetcher } from "../utils";
import { useContext } from "react";
import {
  NtypeSampledNumDictType,
  SampledNumDictType,
  SimpleMiniBatchStatsType,
} from "../models/MiniBatchData";
import { ExexuteIdContext } from "../context";
ChartJS.register(...registerables);

const getEpochSampleIdDict = (miniBatchIdList: string[]) => {
  const uniqueEpochIdList = Array.from(
    new Set(
      miniBatchIdList.map(
        (miniBatchIdList: string) => miniBatchIdList.split("-")[0]
      )
    )
  );
  const uniqueSampleIdList = Array.from(
    new Set(
      miniBatchIdList.map(
        (miniBatchIdList: string) => miniBatchIdList.split("-")[1]
      )
    )
  );
  const epochIdList = Array.from(
    { length: uniqueEpochIdList.length },
    (_, i) => i + 1
  );
  const sampleIdList = Array.from(
    { length: uniqueSampleIdList.length },
    (_, i) => i
  );
  return { epochIdList: epochIdList, sampleIdList: sampleIdList };
};

const sortSampledNumDict = (
  sampledNumDictList: SampledNumDictType[]
): SampledNumDictType[] => {
  const sortFunc = (
    sampledNumDict1: SampledNumDictType,
    sampledNumDict2: SampledNumDictType
  ) => {
    const sampledNumSum1 =
      sampledNumDict1.sourceSampledNum + sampledNumDict1.targetSampledNum;
    const sampledNumSum2 =
      sampledNumDict2.sourceSampledNum + sampledNumDict2.targetSampledNum;
    return sampledNumSum2 - sampledNumSum1;
  };

  return sampledNumDictList.sort(sortFunc);
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
  return {
    labels: labelList,
    datasets: [
      {
        label: label,
        data: dataList,
        backgroundColor: "rgba(75, 192, 192, 0.8)",
      },
    ],
  };
};

const makeBarDataByNtype = (
  sampledNumDictList: SampledNumDictType[],
  topk: number = 20
) => {
  const sortedSampledNumDict: SampledNumDictType[] = sortSampledNumDict(
    sampledNumDictList
  ).slice(0, topk); // -> topk
  const labels: string[] = sortedSampledNumDict.map(
    (sampledNumDict: SampledNumDictType) => sampledNumDict.nodeName
  );
  const sourceData: number[] = sortedSampledNumDict.map(
    (sampledNumDict: SampledNumDictType) => sampledNumDict.sourceSampledNum
  );
  const targetData: number[] = sortedSampledNumDict.map(
    (sampledNumDict: SampledNumDictType) => sampledNumDict.targetSampledNum
  );

  const backgroundColor = (sourceTarget: string) => {
    if (sourceTarget === "source") {
      return "#17C964";
    } else {
      return "#F9CB80";
    }
  };
  return {
    labels: labels,
    datasets: [
      {
        label: "source",
        data: sourceData,
        backgroundColor: backgroundColor("source"),
      },
      {
        label: "target",
        data: targetData,
        backgroundColor: backgroundColor("target"),
      },
    ],
  };
};

const AllMiniBatchStats: React.FC = () => {
  const { executeId, setExecuteId } = useContext(ExexuteIdContext);

  const { data: simpleMiniBatchStats, error } = useSWR<
    SimpleMiniBatchStatsType,
    Error
  >(`/api/all_minibatch_stats/${executeId}`, fetcher);

  if (error) return <div>failed to load</div>;
  if (!simpleMiniBatchStats) return <div>loading...</div>;

  const { epochIdList, sampleIdList } = getEpochSampleIdDict(simpleMiniBatchStats.minibatchIdList);

  const lossList: number[] = simpleMiniBatchStats.lossList;
  const aucList: number[] = simpleMiniBatchStats.aucList;

  const posSampledNumDict: NtypeSampledNumDictType[] =
    simpleMiniBatchStats.posSampledNumList;
  const negSampledNumDict: NtypeSampledNumDictType[] =
    simpleMiniBatchStats.negSampledNumList;

  // user以外のノード種別を描画対象とする
  const ntypeList: string[] = posSampledNumDict
    .map(
      (ntypeSampledNumDict: NtypeSampledNumDictType) =>
        ntypeSampledNumDict.ntype
    )
    .filter((ntype: string) => ntype !== "user");

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

  const ntypeBarOptions = (ntype: string) => {
    const barOptions = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      scales: {
        y: {
          ticks: {
            font: {
              size: 10,
            },
          },
        },
      },
      plugins: {
        legend: {
          position: "top" as const,
        },
        title: {
          display: true,
          text: ntype,
        },
      },
    };
    return barOptions;
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
        {[posSampledNumDict, negSampledNumDict].map(
          (
            ntypeSampledNumDictList: NtypeSampledNumDictType[],
            index: number
          ) => {
            return (
              <Grid xs={6} key={index}>
                <Grid.Container justify="center">
                  <Grid xs={12} justify="center">
                    {index === 0 ? <>Positive</> : <>Negative</>}
                  </Grid>
                  {ntypeList &&
                    ntypeList.map((ntype: string) => {
                      const sampledNumDictList = ntypeSampledNumDictList.filter(
                        (ntypeSampledNumDict: NtypeSampledNumDictType) =>
                          ntypeSampledNumDict.ntype === ntype
                      )[0].sampledNumDictList;

                      const data = makeBarDataByNtype(sampledNumDictList, 20);
                      const vw = Math.floor(100 / ntypeList.length);
                      return (
                        <Grid
                          key={ntype}
                          css={{ w: `${vw}vw`, h: `${vw * 1.5}vw` }}
                        >
                          <Bar options={ntypeBarOptions(ntype)} data={data} />
                        </Grid>
                      );
                    })}
                </Grid.Container>
              </Grid>
            );
          }
        )}
      </Grid.Container>
    </>
  );
};

const Home = () => {
  const { executeId, setExecuteId } = useContext(ExexuteIdContext);

  return (
    <>
      <MyNavbar executeId={executeId} setExecuteId={setExecuteId} />
      <AllMiniBatchStats />
    </>
  );
};

export default Home;
