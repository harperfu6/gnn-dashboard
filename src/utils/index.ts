import {
  MiniBatchScoreType,
  DetaileMiniBatchStatsType,
} from "../models/MiniBatchData";
import * as _ from "underscore";

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const getEtypeList = (
  miniBatchStats: DetaileMiniBatchStatsType
): string[] => {
  return miniBatchStats.score.map((score: MiniBatchScoreType) => score.etype);
};

export const getNtypeList = (
  miniBatchStats: DetaileMiniBatchStatsType
): string[] => {
  const etypeList = getEtypeList(miniBatchStats);
  return _.uniq(
    etypeList.reduce(
      (acc: string[], etype: string) => acc.concat([etype.split("-")[0]]),
      []
    )
  );
};

export const transpose = (array2d: number[][]) =>
  array2d[0].map((col, i) => array2d.map((row) => row[i]));

export const maxValueof2dArray = (array2d: number[][]) =>
  array2d
    .map((array1d: number[]) => array1d.reduce((a, b) => (a > b ? a : b)))
    .reduce((a, b) => (a > b ? a : b));

export const binnig = (
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
    [...Array(arrayLength)]
      .map((_, i) => i)
      .forEach((binRange, r_i) => {
        // 浮動少数の問題のため整数で比較
        const digit_num = 4; // 少数4桁までは対応
        if (r_i == arrayLength - 1) {
          if (
            parseInt(num * 10 ** digit_num) >=
            parseInt(binnigRangeList[r_i] * 10 ** digit_num)
          ) {
            binnigList[r_i] = binnigList[r_i] + 1;
          }
        } else {
          if (
            parseInt(num * 10 ** digit_num) >=
              parseInt(binnigRangeList[r_i] * 10 ** digit_num) &&
            parseInt(num * 10 ** digit_num) <
              parseInt(binnigRangeList[r_i + 1] * 10 ** digit_num)
          ) {
            binnigList[r_i] = binnigList[r_i] + 1;
          }
        }
      });
  });

  return [binnigList, binnigRangeList];
};
