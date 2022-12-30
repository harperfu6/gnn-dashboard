import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";
import {GraphData} from "../../components/ForceGraph";

const handler = async (req: NextApiRequest, res: NextApiResponse<GraphData>) => {
  const jsonDirectory = path.join(process.cwd(), "datasets");
	const fileContents = await fs.readFile(jsonDirectory + '/epoch-1-sampler-0-positive.json', 'utf8');
	return res.status(200).json(JSON.parse(fileContents));
};

export default handler;
