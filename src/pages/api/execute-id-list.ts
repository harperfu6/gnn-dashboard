import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";

const handler = async (req: NextApiRequest, res: NextApiResponse<string[]>) => {
  const jsonDirectory = path.join(
    process.cwd(),
    "datasets",
    "minibatch_stats_json_data"
  );
  const reduceStringList = (strList: string[]) =>
    strList.reduce((acc: string[], file) => acc.concat([file]), []);

  const executeIdList = await fs.readdir(
    jsonDirectory,
    (err: any, files: string[]) => reduceStringList(files)
  );

  return res.status(200).json(executeIdList);
};

export default handler;