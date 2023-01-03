import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";
import {MiniBatchStats} from "../../../../models/minibatchStats";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<MiniBatchStats>
) => {
  const { epochId, sampleId } = req.query;

  const jsonDirectory = path.join(process.cwd(), "datasets");
  const fileContents = await fs.readFile(
    jsonDirectory + `/epoch-${epochId}-sampler-${sampleId}-minibatch_stats.json`,
    "utf8"
  );
  return res.status(200).json(JSON.parse(fileContents));
};

export default handler;
