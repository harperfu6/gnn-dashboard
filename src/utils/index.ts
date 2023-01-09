import {AllMiniBatchStatsType} from "../models/MiniBatchData";

export const getEpochSampleIdList = (data: AllMiniBatchStatsType[]) => {
  const miniBatchIdList = data.map(
    (miniBatchStats: AllMiniBatchStatsType) => miniBatchStats.minibatch_id
  );
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
