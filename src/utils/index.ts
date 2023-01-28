import {
  MiniBatchScoreType,
  DetaileMiniBatchStatsType,
} from "../models/MiniBatchData";
import * as _ from "underscore";

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const getEtypeList = (miniBatchStats: DetaileMiniBatchStatsType): string[] => {
  return miniBatchStats.score.map((score: MiniBatchScoreType) => score.etype);
};

export const getNtypeList = (miniBatchStats: DetaileMiniBatchStatsType): string[] => {
  const etypeList = getEtypeList(miniBatchStats);
  return _.uniq(
    etypeList.reduce(
      (acc: string[], etype: string) => acc.concat([etype.split("-")[0]]),
      []
    )
  );
};
