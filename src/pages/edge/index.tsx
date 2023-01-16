import { GraphData, MyNodeObject } from "../../models/GraphData";
import { Grid } from "@nextui-org/react";
import { useState } from "react";
import NodeItem from "../../components/NodeItem";
import { MiniBatchStatsType } from "../../models/MiniBatchData";
import EdgeItem from "../../components/EdgeItem";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type EdgeScoreProps = {
  miniBatchStats: MiniBatchStatsType;
};

const EdgeScore: React.FC<EdgeScoreProps> = ({ miniBatchStats }) => {
  return (
    <>
      <Grid.Container>
        <Grid>
          <Grid.Container>
            <Grid xs={12}>
              <EdgeItem miniBatchStats={miniBatchStats} />
            </Grid>
          </Grid.Container>
        </Grid>
      </Grid.Container>
    </>
  );
};

export default EdgeScore;
