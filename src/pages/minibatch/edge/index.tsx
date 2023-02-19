import { Grid } from "@nextui-org/react";
import { MiniBatchStatsType } from "../../../models/MiniBatchData";
import EdgeItem from "../../../components/EdgeItem";

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
