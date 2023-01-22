import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";

const handler = async (req: NextApiRequest, res: NextApiResponse<string[]>) => {
  const jsonDirectory = path.join(process.cwd(), "datasets");
  const fileContents = await fs.readFile(
    jsonDirectory + '/tmp.json',
    "utf8"
  );
  return res.status(200).json(JSON.parse(fileContents));
};

export default handler;
