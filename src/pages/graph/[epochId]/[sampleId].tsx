import { useRouter } from "next/router";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { GraphData, MyLinkObject, MyNodeObject } from "../../../models/GraphData";
import GraphStats from "../../../components/GraphStats";
import { Grid } from "@nextui-org/react";
import {useState} from "react";

const MyForceGraph3D = dynamic(() => import("../../../components/ForceGraph"), {
  ssr: false,
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Graph = () => {

  const router = useRouter();
  const { epochId, sampleId } = router.query;

  const { data, error } = useSWR(
    epochId ? `/api/graph/${epochId}/${sampleId}` : null,
    fetcher
  );
  const graphData: GraphData = data;


	const [selectedNodeObject, setSelectedNodeObject] = useState<MyNodeObject>();

  if (error) return <div>Failed to load</div>;
  if (!graphData) return <div>Loading...</div>;


  return (
    <>
      <Grid.Container gap={2} justify="center">
        <Grid xs={4}>
          <GraphStats graphData={graphData} setSelectedNodeObject={setSelectedNodeObject} />
        </Grid>
        <Grid xs={8}>
          <MyForceGraph3D
            graphData={graphData}
						selectedNodeObject={selectedNodeObject}
          />
        </Grid>
      </Grid.Container>
    </>
  );
};

export default Graph;
