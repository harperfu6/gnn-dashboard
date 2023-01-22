import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";

const handler = async (req: NextApiRequest, res: NextApiResponse<string[]>) => {
  const { executeId } = req.query;
  const jsonDirectory = path.join(
    process.cwd(),
    "datasets",
    "minibatch_stats_json_data",
    `${executeId}`,
    "simple"
  );
  const reduceStringList = (strList: string[]) =>
    strList.reduce(
      (acc: string[], file: string) => acc.concat([file.split("_")[0]]),
      []
    );

  const executeIdList = await fs.readdir(
    jsonDirectory,
    (err: any, files: string[]) => reduceStringList(files)
  );

  return res.status(200).json(executeIdList);
};

export default handler;
