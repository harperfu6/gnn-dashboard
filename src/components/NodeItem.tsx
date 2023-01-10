import { Button, Grid, styled } from "@nextui-org/react";
import { useState } from "react";
import { GraphData, MyNodeObject } from "../models/GraphData";

type nodeItemDict = { [ntype: string]: MyNodeObject[] };

const getNodeObjectDict = (graphData: GraphData): nodeItemDict => {
  const ntype = graphData.ntype;
  const nodes = graphData.nodes;

  let itemDict: { [ntype: string]: MyNodeObject[] } = {};
  ntype.forEach((n) => {
    itemDict[n] = nodes.filter((node) => node.ntype == n);
  });
  return itemDict;
};

const sortNodeItemDict = (nodeItemDict: nodeItemDict): nodeItemDict => {
  const compareFunc = (
    nodeItem1: MyNodeObject,
    nodeItem2: MyNodeObject
  ): number => {
    return nodeItem1.id > nodeItem2.id ? 1 : -1;
  };
  let newNodeItemDict: { [ntype: string]: MyNodeObject[] } = {};
  Object.entries(nodeItemDict).forEach(([ntype, items]) => {
    items.sort(compareFunc);
    newNodeItemDict[ntype] = items;
  });
  return newNodeItemDict;
};

type NodeItemProps = {
  graphData: GraphData;
  setSelectedNodeObject: (myNodeObject: MyNodeObject) => void;
};

const NodeItem: React.FC<NodeItemProps> = ({
  graphData,
  setSelectedNodeObject,
}) => {
  const ntypeList = graphData.ntype;

  // node type button
  const [selectedNtype, setSelectedNtype] = useState<string>(ntypeList[0]);
  // node item button
  const [selectedNodeObjectId, setSelectedNodeObjectId] = useState<string>("");
  const nodeItemDict = sortNodeItemDict(getNodeObjectDict(graphData));
  const [targetNodeItemList, setTargetNodeItemList] = useState<MyNodeObject[]>(
    nodeItemDict[ntypeList[0]]
  );

  const onNodeTypeClicked = (selectedNtype: string) => {
    setSelectedNtype(selectedNtype); // 強調表示用
    setTargetNodeItemList(nodeItemDict[selectedNtype]); // リスト表示用
  };

  const onNodeItemClicked = (selectedNodeItem: MyNodeObject) => {
    setSelectedNodeObjectId(selectedNodeItem.id); // 強調表示用
    setSelectedNodeObject(selectedNodeItem); // Graphとの連携用
  };

  return (
    <>
      <Grid.Container>
        <Grid>
          {ntypeList.map((ntype: string) => {
            if (ntype === selectedNtype) {
              return (
                <NodeTypeButton
                  key={ntype}
                  size="basic"
                  color="selected"
                  onPress={() => onNodeTypeClicked(ntype)}
                >
                  {ntype}
                </NodeTypeButton>
              );
            } else {
              return (
                <NodeTypeButton
                  key={ntype}
                  size="basic"
                  color="basic"
                  onPress={() => onNodeTypeClicked(ntype)}
                >
                  {ntype}
                </NodeTypeButton>
              );
            }
          })}
        </Grid>
        <Grid
          css={{
            h: "250px",
            overflow: "scroll",
          }}
        >
          {targetNodeItemList.map((nodeItem: MyNodeObject) => {
            if (nodeItem.id === selectedNodeObjectId) {
              return (
                <NodeItemButton
                  key={nodeItem.id}
                  size="basic"
                  color="selected"
                  onPress={() => onNodeItemClicked(nodeItem)}
                >
                  {nodeItem.id}
                </NodeItemButton>
              );
            } else {
              return (
                <NodeItemButton
                  key={nodeItem.id}
                  size="basic"
                  color="basic"
                  onPress={() => onNodeItemClicked(nodeItem)}
                >
                  {nodeItem.id}
                </NodeItemButton>
              );
            }
          })}
        </Grid>
      </Grid.Container>
    </>
  );
};

const NodeTypeButton = styled(Button, {
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

const NodeItemButton = styled(Button, {
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
        background: "$white",
      },
      selected: {
        color: "$black",
        background: "$blue500",
      },
    },
  },
});

export default NodeItem;
