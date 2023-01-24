import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import util from "util";

const readDir = util.promisify(fs.readdir);

const handler = async (req: NextApiRequest, res: NextApiResponse<string[]>) => {
  const { executeId } = req.query;
  const jsonDirectory = path.join(
    process.cwd(),
    "datasets",
    "minibatch_stats_json_data",
    `${executeId}`,
    "simple"
  );
  const reduceFileList = (files: string[]) => {
    return files.reduce(
      (acc: string[], file: string) => acc.concat([file.split("_")[0]]),
      []
    );
  };

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

  const readEpochSampleId = async (path: string) => {
    const filenames = await readDir(path);
    return getEpochSampleIdDict(reduceFileList(filenames));
  };

  const executeIdDict = await readEpochSampleId(jsonDirectory);

  return res.status(200).json(executeIdDict);
};

export default handler;
