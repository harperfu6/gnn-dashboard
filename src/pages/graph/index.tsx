import { useRouter } from "next/router";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { GraphData, MyLinkObject, MyNodeObject } from "../../models/GraphData";
import { Grid } from "@nextui-org/react";
import { useState } from "react";
import NodeItem from "../../components/NodeItem";

const MyForceGraph3D = dynamic(() => import("../../components/ForceGraph"), {
  ssr: false,
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type GraphProps = {
  graphData: GraphData;
};

const Graph: React.FC<GraphProps> = ({ graphData }) => {
  const [selectedNodeObject, setSelectedNodeObject] = useState<MyNodeObject>();

  return (
    <>
      <Grid.Container>
        <Grid>
          <Grid.Container>
            <Grid xs={12}>
              <NodeItem
                graphData={graphData}
                setSelectedNodeObject={setSelectedNodeObject}
              />
            </Grid>
          </Grid.Container>
        </Grid>
      </Grid.Container>
    </>
  );
};

            {/* <Grid xs={12}> */}
            {/*   <MyForceGraph3D */}
            {/*     graphData={graphData} */}
            {/*     selectedNodeObject={selectedNodeObject} */}
            {/*   /> */}
            {/* </Grid> */}

export default Graph;
