import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) => {
  const { executeId } = req.query;
  const jsonDirectory = path.join(
    process.cwd(),
    "datasets",
    "minibatch_stats_json_data",
    `${executeId}`,
    "simple"
  );

  const reduceFileList = (fileList: string[]) =>
    fileList.reduce(
      (acc: string[], file: string) => acc.concat([file.split("_")[0]]),
      []
    );

  const simpleStatsFileList = await fs.readdir(
    jsonDirectory,
    (err: any, files: string[]) => reduceFileList(files)
  );

  const readFile = async (fileName: string) =>
    await fs.readFile(jsonDirectory + `/${fileName}`, "utf8");

	console.log(simpleStatsFileList)

	const allSimpleMiniBatchStats = await simpleStatsFileList.reduce(async (acc: string[], file:string) => {
		const readFileContents = await readFile(file);
		return (await acc).concat([readFileContents]);
	}, [])

	return res.status(200).json(JSON.parse(JSON.stringify(allSimpleMiniBatchStats)));
};

export default handler;
