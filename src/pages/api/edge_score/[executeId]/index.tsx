import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import { promises as pfs } from "fs";
import util from "util";

import { DetaileMiniBatchStatsType } from "../../../../models/MiniBatchData";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { executeId } = req.query;
  const jsonDirectory = path.join(
    process.cwd(),
    "datasets",
    "minibatch_stats_json_data",
    `${executeId}`,
    "detail/"
  );

	const readDir = util.promisify(fs.readdir);

  const readFile = async (filename: string) =>
    await pfs.readFile(jsonDirectory + `/${filename}`, "utf8");

  const readFiles = async (dirName: string) => {
    const filenames = await readDir(dirName);

    const contentList = await filenames.reduce(
      async (contentList: any[], filename: string) => {
        const content = await readFile(filename);
        return (await contentList).concat([JSON.parse(content)]);
      },
      []
    );
    return contentList;
  };

  const contentList = await readFiles(jsonDirectory);

  return res.status(200).json(contentList);
};

export default handler;
