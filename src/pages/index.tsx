import styles from "../styles/Home.module.css";

import useSWR from "swr";

import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { Grid, Spacer, Text } from "@nextui-org/react";
import MyNavbar from "../components/Nav";
import {
  fetcher,
  getEpochSampleIdList,
  parseAllSimpleMiniBatchStats,
} from "../utils";
import { useContext, useState } from "react";
import { AllMiniBatchStatsType, SampledNumType } from "../models/MiniBatchData";
import { ExexuteIdContext } from "../context";
import assert from "assert";
ChartJS.register(...registerables);

const makeLossList = (data: AllMiniBatchStatsType[]) => {
  return data.map((mbd: AllMiniBatchStatsType) => mbd.loss);
};

const makeAucList = (data: AllMiniBatchStatsType[]) => {
  return data.map((mbd: AllMiniBatchStatsType) => mbd.auc);
};

type SampledNumDictType = {
  nodeName: string;
  sourceSampledNum: number;
  targetSampledNum: number;
};

type NtypeSampledNumDictType = {
  ntype: string;
  sampledNumDict: SampledNumDictType[];
};

const appendSampledNumDict = (
  sampledNumDictList: SampledNumDictType[],
  sampledNumDict: SampledNumDictType
): SampledNumDictType[] => {
  const interstSampledNumDictList = sampledNumDictList.filter(
    (_sampledNumDict: SampledNumDictType) =>
      _sampledNumDict.nodeName === sampledNumDict.nodeName
  );
  assert(interstSampledNumDictList.length <= 1);

  // すでに格納済みの場合はサンプル数を加えて再格納
  if (interstSampledNumDictList.length === 1) {
    const interstSampledNumDict = interstSampledNumDictList[0];
    const newSampledNumDict = {
      nodeName: interstSampledNumDict.nodeName,
      sourceSampledNum:
        interstSampledNumDict.sourceSampledNum +
        sampledNumDict.sourceSampledNum,
      targetSampledNum:
        interstSampledNumDict.targetSampledNum +
        sampledNumDict.targetSampledNum,
    };
    const exceptSampledNumDictList = sampledNumDictList.filter(
      (_sampledNumDict: SampledNumDictType) =>
        _sampledNumDict.nodeName !== sampledNumDict.nodeName
    );
    return exceptSampledNumDictList.concat([newSampledNumDict]);
  } else {
    return sampledNumDictList.concat([sampledNumDict]);
  }
};

const appendNtypeSampledNumDict = (
  ntypeSampledNumDictList: NtypeSampledNumDictType[],
  ntypeSampledNumDict: NtypeSampledNumDictType
): NtypeSampledNumDictType[] => {
  // 対象ノード種別について追加処理
  // 既に格納済みのリストに
  const sampledNumDictList = ntypeSampledNumDictList.filter(
    (_ntypeSampledNumDict: NtypeSampledNumDictType) =>
      _ntypeSampledNumDict.ntype === ntypeSampledNumDict.ntype
  );

  assert(sampledNumDictList.length <= 1);

  if (sampledNumDictList.length === 1) {
    const targetSampledNumDictList = sampledNumDictList[0].sampledNumDict;
    // 追加するリスト
    const appendedSampledNumDictList = ntypeSampledNumDict.sampledNumDict;
    const newSampledNumDictList = appendedSampledNumDictList.reduce(
      (acc: SampledNumDictType[], sampledNumDict: SampledNumDictType) => {
        return appendSampledNumDict(acc, sampledNumDict);
      },
      targetSampledNumDictList
    );
    const newNtypeSampledNumDict = {
      ntype: ntypeSampledNumDict.ntype,
      sampledNumDict: newSampledNumDictList,
    };
    // 対象ノード以外
    const exceptSampledNumDictList = ntypeSampledNumDictList.filter(
      (_ntypeSampledNumDict: NtypeSampledNumDictType) =>
        _ntypeSampledNumDict.ntype !== ntypeSampledNumDict.ntype
    );

    return exceptSampledNumDictList.concat([newNtypeSampledNumDict]);
  } else {
    // そもそも対象ノードが未格納の場合
    return ntypeSampledNumDictList.concat([ntypeSampledNumDict]);
  }
};

const sampledNum2NtypeSampledNumDict = (
  sampledNum: SampledNumType,
  posNeg: string
): NtypeSampledNumDictType => {
  const ntype = sampledNum.ntype;
  const makeSampledNumDict = (rawSampledNumDict: {
    [node: string]: number;
  }): SampledNumDictType[] => {
    return Object.entries(rawSampledNumDict).map(
      ([node, num]: [string, number]) => {
        if (sampledNum.source_target == "source") {
          return {
            nodeName: node,
            sourceSampledNum: num,
            targetSampledNum: 0,
          };
        } else {
          return {
            nodeName: node,
            sourceSampledNum: 0,
            targetSampledNum: num,
          };
        }
      }
    );
  };
  if (posNeg === "pos") {
    const sampledNumDict = makeSampledNumDict(sampledNum.pos);
    return {
      ntype: ntype,
      sampledNumDict: sampledNumDict,
    };
  } else {
    const sampledNumDict = makeSampledNumDict(sampledNum.neg);
    return {
      ntype: ntype,
      sampledNumDict: sampledNumDict,
    };
  }
};

const makeSampledNumDict = (
  data: AllMiniBatchStatsType[],
  posNeg: string
): NtypeSampledNumDictType[] => {
  const reduceAllMiniBatchList = (
    allMiniBatchStatsList: AllMiniBatchStatsType,
    posNeg: string
  ): NtypeSampledNumDictType[] => {
    return allMiniBatchStatsList.sampled_num.reduce(
      (acc: NtypeSampledNumDictType[], sampledNum: SampledNumType) => {
        const ntypeSampledNumDict = sampledNum2NtypeSampledNumDict(
          sampledNum,
          posNeg
        );
        return appendNtypeSampledNumDict(acc, ntypeSampledNumDict);
      },
      []
    );
  };

  return data.reduce(
    (
      acc: NtypeSampledNumDictType[],
      allMiniBatchStatsList: AllMiniBatchStatsType
    ) => {
      const ntypeSampledNumDictList = reduceAllMiniBatchList(
        allMiniBatchStatsList,
        posNeg
      );
      return ntypeSampledNumDictList.reduce(
        (
          _acc: NtypeSampledNumDictType[],
          ntypeSampledNumDict: NtypeSampledNumDictType
        ) => {
          return appendNtypeSampledNumDict(_acc, ntypeSampledNumDict);
        },
        acc
      );
    },
    []
  );
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

  const { data: epochSampleIdDict } = useSWR(
    `/api/minibatch_stats/${executeId}/epoch-sample-id-list`,
    fetcher
  );

  const { data: allMiniBatchStatsStringList, error } = useSWR(
    `/api/all_minibatch_stats/${executeId}`,
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (!allMiniBatchStatsStringList) return <div>loading...</div>;

  const allMiniBatchStatsList = parseAllSimpleMiniBatchStats(
    allMiniBatchStatsStringList
  );
  console.log(allMiniBatchStatsList);

  const { epochIdList, sampleIdList } = epochSampleIdDict;

  const lossList: number[] = makeLossList(allMiniBatchStatsList);
  const aucList: number[] = makeAucList(allMiniBatchStatsList);

  const posSampledNumDict: NtypeSampledNumDictType[] = makeSampledNumDict(
    allMiniBatchStatsList,
    "pos"
  );

  const negSampledNumDict: NtypeSampledNumDictType[] = makeSampledNumDict(
    allMiniBatchStatsList,
    "neg"
  );

  // remove user
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
                      const sampledNumDict = ntypeSampledNumDictList.filter(
                        (ntypeSampledNumDict: NtypeSampledNumDictType) =>
                          ntypeSampledNumDict.ntype === ntype
                      )[0].sampledNumDict;

                      const data = makeBarDataByNtype(sampledNumDict, 20);
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
