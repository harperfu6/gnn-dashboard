import { Button, Grid, styled } from "@nextui-org/react";
import { useState } from "react";
import { MiniBatchStatsType } from "../models/MiniBatchData";

const getEtypeList = (miniBatchStats: MiniBatchStatsType): string[] => {
  return Object.keys(miniBatchStats.pos_score); // 代表して正例のリストからエッジ種別を取得
};

type EdgeItemType = {
  miniBatchStats: MiniBatchStatsType;
};

const EdgeItem: React.FC<EdgeItemType> = ({ miniBatchStats }) => {
  const etypeList = getEtypeList(miniBatchStats);

  // etype list button
  const [selectedEtype, setSelectedEtype] = useState<string>(etypeList[0]);

  const onEdgeTypeClicked = (selectedEtype: string) => {
    setSelectedEtype(selectedEtype); // 強調表示用
  };

  return (
    <>
      <Grid.Container>
        <Grid>
          {etypeList.map((etype: string) => {
            if (etype === selectedEtype) {
              return (
                <EdgeTypeButton
                  key={etype}
                  size="basic"
                  color="selected"
                  onPress={() => onEdgeTypeClicked(etype)}
                >
                  {etype}
                </EdgeTypeButton>
              );
            } else {
              return (
                <EdgeTypeButton
                  key={etype}
                  size="basic"
                  color="basic"
                  onPress={() => onEdgeTypeClicked(etype)}
                >
                  {etype}
                </EdgeTypeButton>
              );
            }
          })}
        </Grid>
      </Grid.Container>
    </>
  );
};

const EdgeTypeButton = styled(Button, {
  variants: {
    size: {
      basic: {
        height: "$15",
        borderRadius: "0",
      },
    },
    color: {
      basic: {
        color: "$black",
        background: "$gray500",
      },
      selected: {
        color: "$black",
        background: "$white",
      },
    },
  },
});

export default EdgeItem;
