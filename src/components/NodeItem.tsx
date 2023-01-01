import { Button, Grid, styled } from "@nextui-org/react";
import { useState } from "react";
import { GraphData, MyNodeObject } from "../models/GraphData";

type ButtonNodeObject = MyNodeObject & {
  selected: boolean;
};
type ButtonNodeItemDict = { [ntype: string]: ButtonNodeObject[] };

const addSelect2NodeObject = (
  nodeObjects: MyNodeObject[]
): ButtonNodeObject[] => {
  const buttonNodeObjects = nodeObjects.map((nodeItem: MyNodeObject) => {
    const _nodeItem = { ...nodeItem, selected: false };
    return _nodeItem;
  });
  return buttonNodeObjects;
};

const getNodeItemDict = (graphData: GraphData): ButtonNodeItemDict => {
  const ntype = graphData.ntype;
  const nodes = graphData.nodes;

  // add selection attribute for button selection
  const nodesWithSelect = addSelect2NodeObject(nodes);

  let itemDict: { [ntype: string]: ButtonNodeObject[] } = {};
  ntype.forEach((n) => {
    itemDict[n] = nodesWithSelect.filter((node) => node.ntype == n);
  });
  return itemDict;
};

const sortNodeItemDict = (
  nodeItemDict: ButtonNodeItemDict
): ButtonNodeItemDict => {
  const compareFunc = (
    nodeItem1: ButtonNodeObject,
    nodeItem2: ButtonNodeObject
  ): number => {
    return nodeItem1.id > nodeItem2.id ? 1 : -1;
  };
  let newNodeItemDict: { [ntype: string]: ButtonNodeObject[] } = {};
  Object.entries(nodeItemDict).forEach(([ntype, items]) => {
    items.sort(compareFunc);
    newNodeItemDict[ntype] = items;
  });
  return newNodeItemDict;
};

type NodeItemProps = {
  graphData: GraphData;
};

const NodeItem = (props: NodeItemProps) => {
  const graphData = props.graphData;
  const ntypeList = graphData.ntype;

  // node type button
  let selectedNtypeDictDefault: { [ntype: string]: boolean } = {};
  ntypeList.forEach((ntype) => {
    selectedNtypeDictDefault[ntype] = false;
  });

  const ntypeDefault = ntypeList[0];
  selectedNtypeDictDefault[ntypeDefault] = true;
  const [selectedNtype, setSelectedNtype] = useState<string>(ntypeDefault);
  const [selectedNtypeDict, setSelectedNtypeDict] = useState<{
    [ntype: string]: boolean;
  }>(selectedNtypeDictDefault);

  const onNodeTypeClicked = (selectedNtype: string) => {
    let _selectedNtypeDict: { [ntype: string]: boolean } = {};
    ntypeList.forEach((n) => {
      if (n === selectedNtype) {
        _selectedNtypeDict[n] = true;
      } else {
        _selectedNtypeDict[n] = false;
      }
    });
    setSelectedNtypeDict(_selectedNtypeDict);
    setSelectedNtype(selectedNtype);
  };

  // node item button
  const nodeItemDictDefalut = sortNodeItemDict(getNodeItemDict(graphData));
  const [selectedNodeItemDict, setSelectedNodeItemDict] =
    useState<ButtonNodeItemDict>(nodeItemDictDefalut);

  const onNodeItemClicked = (
    selectedNtype: string,
    selectedNodeItem: ButtonNodeObject
  ) => {
		console.log(nodeItemDictDefalut);
    setSelectedNodeItemDict(nodeItemDictDefalut);

    const _selectedNodeItem = { ...selectedNodeItem, selected: true };
    const nodeItemList = selectedNodeItemDict[selectedNtype];
    let newNodeItemList = nodeItemList.filter(
      (item: ButtonNodeObject) => item.id !== selectedNodeItem.id
    );
    newNodeItemList.push(_selectedNodeItem);
    let newSelectedNodeItemDict = selectedNodeItemDict;
    delete newSelectedNodeItemDict[selectedNtype];
    newSelectedNodeItemDict[selectedNtype] = newNodeItemList;

    setSelectedNodeItemDict(sortNodeItemDict(newSelectedNodeItemDict));
  };

  return (
    <>
      <Grid.Container>
        <Grid>
          {ntypeList.map((ntype: string) => {
            if (selectedNtypeDict[ntype] === true) {
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
          {selectedNodeItemDict[selectedNtype].map(
            (nodeItem: ButtonNodeObject) => {
              if (nodeItem.selected === true) {
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
            }
          )}
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
