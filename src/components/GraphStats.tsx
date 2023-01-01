import { Button, Grid, Spacer } from "@nextui-org/react";
import { GraphData, MyNodeObject } from "../models/GraphData";
import Describe from "./Describe";
import NodeItem from "./NodeItem";

type GraphStatsProps = {
  graphData: GraphData;
};

const GraphStats = (props: GraphStatsProps) => {
  const graphData = props.graphData;
  const nodes = graphData.nodes;
  const links = graphData.links;

  return (
    <>
      <Grid.Container direction="column">
        <Grid>
          <Describe graphData={graphData} />
        </Grid>
        <Spacer />
        <Grid>
          <NodeItem graphData={graphData} />
        </Grid>
      </Grid.Container>
    </>
  );
};

export default GraphStats;
