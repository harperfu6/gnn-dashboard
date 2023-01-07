import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";
import {AllMiniBatchStats} from "../../../models/minibatchStats";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<AllMiniBatchStats[]>
) => {

  const jsonDirectory = path.join(process.cwd(), "datasets");
  const fileContents = await fs.readFile(
    jsonDirectory + `/all_minibatch_stats.json`,
    "utf8"
  );
  return res.status(200).json(JSON.parse(fileContents));
};

export default handler;
