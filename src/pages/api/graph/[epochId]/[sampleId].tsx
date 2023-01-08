import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";
import { GraphData } from "../../../../models/GraphData";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<GraphData>
) => {
  const { epochId, sampleId } = req.query;

  const jsonDirectory = path.join(process.cwd(), "datasets", "minibatch_stats_json_data");
  const fileContents = await fs.readFile(
    jsonDirectory + `/epoch${epochId}-sample${sampleId}-positive_graph.json`,
    "utf8"
  );
  return res.status(200).json(JSON.parse(fileContents));
};

export default handler;
