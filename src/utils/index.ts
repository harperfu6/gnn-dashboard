import {
  SimpleMiniBatchStatsType,
  MiniBatchScoreType,
  DetaileMiniBatchStatsType,
} from "../models/MiniBatchData";
import * as _ from "underscore";

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const parseAllSimpleMiniBatchStats = (
  allSimpleMiniBatchStatsList: string[]
): SimpleMiniBatchStatsType[] => {
  return allSimpleMiniBatchStatsList.reduce(
    (acc: SimpleMiniBatchStatsType[], stringStats: string) =>
      acc.concat([JSON.parse(stringStats)]),
    []
  );
};

// export const getEpochSampleIdList = (data: AllMiniBatchStatsType[]) => {
//   const miniBatchIdList = data.map(
//     (miniBatchStats: AllMiniBatchStatsType) => miniBatchStats.minibatch_id
//   );
//   const uniqueEpochIdList = Array.from(
//     new Set(
//       miniBatchIdList.map(
//         (miniBatchIdList: string) => miniBatchIdList.split("-")[0]
//       )
//     )
//   );
//   const uniqueSampleIdList = Array.from(
//     new Set(
//       miniBatchIdList.map(
//         (miniBatchIdList: string) => miniBatchIdList.split("-")[1]
//       )
//     )
//   );
//   const epochIdList = Array.from(
//     { length: uniqueEpochIdList.length },
//     (_, i) => i + 1
//   );
//   const sampleIdList = Array.from(
//     { length: uniqueSampleIdList.length },
//     (_, i) => i
//   );
//   return { epochIdList: epochIdList, sampleIdList: sampleIdList };
// };

export const getEtypeList = (miniBatchStats: MiniBatchStatsType): string[] => {
  return miniBatchStats.score.map((score: MiniBatchScoreType) => score.etype);
};

export const getNtypeList = (miniBatchStats: MiniBatchStatsType): string[] => {
  const etypeList = getEtypeList(miniBatchStats);
  return _.uniq(
    etypeList.reduce(
      (acc: string[], etype: string) => acc.concat([etype.split("-")[0]]),
      []
    )
  );
};
