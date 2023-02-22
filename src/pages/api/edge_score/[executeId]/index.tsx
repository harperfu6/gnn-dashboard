import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";

import { DetaileMiniBatchStatsType } from "../../../../models/MiniBatchData";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { executeId } = req.query;
  const jsonDirectory = path.join(
    process.cwd(),
    "datasets",
    "minibatch_stats_json_data",
    `${executeId}`,
    "detail"
  );

  const fileContents = await fs.readFile(
    jsonDirectory + `/detail_stats.json`,
    "utf8"
  );

  return res.status(200).json(JSON.parse(fileContents));
};

export default handler;
