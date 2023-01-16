import { Button, Grid, Text, styled } from "@nextui-org/react";
import { useState } from "react";
import {
  EdgeScoreType,
  MiniBatchScoreType,
  MiniBatchStatsType,
} from "../models/MiniBatchData";
import * as _ from "underscore";
import { getEtypeList } from "../utils";

type EdgeItemDict = {
  edge: string;
  score: number;
};

type PosNegItemDict = {
  positive: EdgeItemDict[];
  negative: EdgeItemDict[];
};
type EdgeScoreItemDict = { [etype: string]: PosNegItemDict };

const getEdgeItemDict = (
  miniBatchStats: MiniBatchStatsType,
  etypeList: string[]
): EdgeScoreItemDict => {
  const edgeItemList = (edgeScoreDict: EdgeScoreType): EdgeItemDict[] => {
    const edgePairList = _.zip(
      edgeScoreDict.source_node_id,
      edgeScoreDict.target_node_id,
      edgeScoreDict.score
    );
    const edgeList = edgePairList.reduce(
      (acc: EdgeItemDict[], edgeScorePair: string[]) => {
        const itemDict = {
          edge: `${edgeScorePair[0]}-${edgeScorePair[1]}`,
          score: Number(edgeScorePair[2]),
        };
        return acc.concat(itemDict);
      },
      []
    );
    return edgeList;
  };

  const sortEdgeItemDictList = (edgeItemDictList: EdgeItemDict[]) =>
    edgeItemDictList.sort((a: EdgeItemDict, b: EdgeItemDict) => {
      if (a.edge.split("-")[0] < b.edge.split("-")[0]) {
        return -1;
      } else {
        return 1;
      }
    });

  return etypeList.reduce((acc: EdgeScoreItemDict, etype: string) => {
    const targetEtypeScore = miniBatchStats.score.filter(
      (score: MiniBatchScoreType) => score.etype === etype
    )[0];
    const posItemList = sortEdgeItemDictList(
      edgeItemList(targetEtypeScore.pos_score)
    );
    const negItemList = sortEdgeItemDictList(
      edgeItemList(targetEtypeScore.neg_score)
    );
    const posNegItemDict = {
      positive: posItemList,
      negative: negItemList,
    };
    acc[etype] = posNegItemDict;
    return acc;
  }, {});
};

type EdgeItemType = {
  miniBatchStats: MiniBatchStatsType;
};

const EdgeItem: React.FC<EdgeItemType> = ({ miniBatchStats }) => {
  const etypeList = getEtypeList(miniBatchStats);

  // etype list button
  const [selectedEtype, setSelectedEtype] = useState<string>(etypeList[0]);

  // etype item list
  const edgeItemDict = getEdgeItemDict(miniBatchStats, etypeList);
  const [targetEdgeItemList, setTargetEdgeItemList] = useState<PosNegItemDict>(
    edgeItemDict[etypeList[0]]
  );

  const onEdgeTypeClicked = (selectedEtype: string) => {
    setSelectedEtype(selectedEtype); // 強調表示用
    setTargetEdgeItemList(edgeItemDict[selectedEtype]); // リスト表示用
  };

  const edgeTypeButtonWidth = Math.floor(6 / etypeList.length);
  return (
    <>
      <Grid.Container>
        <Grid xs={12}>
          {etypeList.map((etype: string) => {
            // userから始まらないエッジを上部に表示
            if (etype.split("-")[0] !== "user") {
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
            }
          })}
        </Grid>
        <Grid xs={12}>
          {etypeList.map((etype: string) => {
            if (etype.split("-")[0] === "user") {
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
            }
          })}
        </Grid>
        <Grid xs={12}>
          {[targetEdgeItemList.positive, targetEdgeItemList.negative].map(
            (edgeItemList: EdgeItemDict[], index: number) => {
              return (
                <Grid
                  key={index}
                  css={{
                    h: "70vh",
                    w: "23vw",
                    overflow: "scroll",
                  }}
                >
                  {edgeItemList.map((edgeItem: EdgeItemDict) => {
                    const scoreColor = (
                      score: number,
                      index: number
                    ): string => {
                      if (index === 0) {
                        // positive
                        if (score >= 0.9) {
                          return "good";
                        } else if (score <= 0.1) {
                          return "bad";
                        } else {
                          return "basic";
                        }
                      } else {
                        // negative
                        if (score >= 0.9) {
                          return "bad";
                        } else if (score <= 0.1) {
                          return "good";
                        } else {
                          return "basic";
                        }
                      }
                    };

                    return (
                      <>
                        <EdgeText
                          key={`${edgeItem.edge}-edge`}
                          size="basic"
                          color={index === 0 ? "pos" : "neg"}
                          display="basic"
                        >
                          {edgeItem.edge}
                        </EdgeText>

                        <EdgeScoreText
                          key={`${edgeItem.edge}-score`}
                          size="basic"
                          color={scoreColor(edgeItem.score, index)}
                          display="basic"
                        >
                          {edgeItem.score}
                        </EdgeScoreText>
                      </>
                    );
                  })}
                </Grid>
              );
            }
          )}
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
        width: "8vw",
        borderRadius: "0",
        fontSize: "12px",
        minWidth: "0px",
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

const EdgeText = styled(Text, {
  variants: {
    size: {
      basic: {
        height: "$15",
        width: "18vw", // スクロール分を考慮しないといけないっぽい
        borderRadius: "0",
        minWidth: "0px",
        fontSize: "12px",
      },
    },
    color: {
      pos: {
        color: "$black",
        background: "$blue50",
      },
      neg: {
        color: "$black",
        background: "$red50",
      },
    },
    display: {
      basic: {
        float: "left",
      },
    },
  },
});

const EdgeScoreText = styled(Text, {
  variants: {
    size: {
      basic: {
        height: "$15",
        width: "3vw",
        borderRadius: "0",
        minWidth: "0px",
        fontSize: "12px",
      },
    },
    color: {
      basic: {
        color: "$black",
        background: "$white",
      },
      good: {
        color: "$black",
        background: "$success",
      },
      bad: {
        color: "$blac",
        background: "$error",
      },
    },
    display: {
      basic: {
        textAlign: "center",
        float: "right",
      },
    },
  },
});

export default EdgeItem;
