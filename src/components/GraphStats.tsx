import { Button, Grid, Spacer } from "@nextui-org/react";
import { GraphData, MyNodeObject } from "../models/GraphData";
import MiniBatchStats from "../pages/minibatch_stats/[epochId]/[sampleId]";
import Describe from "./Describe";

type GraphStatsProps = {
  graphData: GraphData;
  setSelectedNodeObject: (myNodeObject: MyNodeObject) => void;
  epochId: number;
  sampleId: number;
};

const GraphStats: React.FC<GraphStatsProps> = ({
  graphData,
  setSelectedNodeObject,
  epochId,
  sampleId,
}) => {
  return (
    <>
      <Grid.Container>
        <Grid xs={12}>
          <Describe graphData={graphData} />
        </Grid>
        <Grid xs={12}>
          <MiniBatchStats epochId={epochId} sampleId={sampleId} />
        </Grid>
      </Grid.Container>
    </>
  );
};

export default GraphStats;
