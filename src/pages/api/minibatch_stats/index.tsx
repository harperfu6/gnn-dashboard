import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";
import {AllMiniBatchStatsType} from "../../../models/MiniBatchData";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<AllMiniBatchStatsType[]>
) => {

  const jsonDirectory = path.join(process.cwd(), "datasets", "minibatch_stats_json_data");
  const fileContents = await fs.readFile(
    jsonDirectory + `/all_minibatch_stats.json`,
    "utf8"
  );
  return res.status(200).json(JSON.parse(fileContents));
};

export default handler;
