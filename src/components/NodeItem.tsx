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

const NodeItem = (props: NodeItemProps) => {
  const graphData = props.graphData;
  const ntypeList = graphData.ntype;

  // node type button
  const [selectedNtype, setSelectedNtype] = useState<string>(ntypeList[0]);

  const onNodeTypeClicked = (selectedNtype: string) => {
    setSelectedNtype(selectedNtype);
  };

  // node item button
  const nodeItemDict = sortNodeItemDict(getNodeObjectDict(graphData));
  const [selectedNodeObjectId, setSelectedNodeObjectId] = useState<string>("");

  const onNodeItemClicked = (
    selectedNtype: string,
    selectedNodeItem: MyNodeObject
  ) => {
    setSelectedNodeObjectId(selectedNodeItem.id);
		props.setSelectedNodeObject(selectedNodeItem);
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
            h: "500px",
            overflow: "scroll",
          }}
        >
          {nodeItemDict[selectedNtype].map((nodeItem: ButtonNodeObject) => {
            if (nodeItem.id === selectedNodeObjectId) {
              return (
                <NodeItemButton
                  key={nodeItem.id}
                  size="basic"
                  color="selected"
                  onPress={() => onNodeItemClicked(selectedNtype, nodeItem)}
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
                  onPress={() => onNodeItemClicked(selectedNtype, nodeItem)}
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
