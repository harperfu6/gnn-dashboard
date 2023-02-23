import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import promise from "fs";
import util from "util";
const readDir = util.promisify(fs.readdir);

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



  {/* const readFiles = async (dirName: string) => { */}
  {/*   fs.readdir(dirName, async (_, filenames: string[]) => { */}
			{/* await Promise.all(filenames.map(async (filename:string) => { */}
  {/*        const content = await promise.readFile(`${dirName}/${filename}`, "utf-8"); */}
				{/* console.log(content) */}
			{/* })) */}
  {/*   }); */}
  {/* })}; */}

	{/* await readFiles(jsonDirectory) */}
	{/* const contentsList = [] */}




	function readFiles(dirname, onFileContent, onError) {
	  fs.readdir(dirname, function(err, filenames) {
	    if (err) {
	      onError(err);
	      return;
	    }
			console.log(filenames)
	    filenames.forEach(function(filename) {
	      fs.readFile(dirname + filename, 'utf-8', function(err, content) {
	        if (err) {
	          onError(err);
	          return;
	        }
	        onFileContent(filename, content);
	      });
	    });
	  });
	}

	var data = {};
	readFiles(jsonDirectory, function(filename, content) {
	  data[filename] = content;
	}, function(err) {
	  throw err;
	});

	console.log(data)


  return res.status(200).json(JSON.stringify(data));
};

export default handler;
