import { Grid } from "@nextui-org/react";
import assert from "assert";
import { Bar } from "react-chartjs-2";
import { GraphData, MyLinkObject, MyNodeObject } from "../models/GraphData";
import { EdgeDict, MiniBatchStatsType, NodeDict } from "../models/MiniBatchData";
import { getEtypeList, getNtypeList } from "../utils";

const numByNtype = (
  nodes: NodeDict[],
  ntype: string,
  posNeg: string
): number => {
  const targetNodeDictList = nodes.filter(
    (node: NodeDict) => node.ntype === ntype
  );
  assert(targetNodeDictList.length === 1);
  const targetNodeDict = targetNodeDictList[0];
  switch (posNeg) {
    case "pos":
      return targetNodeDict.positive.length;
    case "neg":
      return targetNodeDict.negative.length;
    default:
      console.log("invalid posNeg");
      return 0;
  }
};

const numByEtype = (
  edges: EdgeDict[],
  etype: string,
  posNeg: string
): number => {
  const targetEdgeDictList = edges.filter(
    (edge: EdgeDict) => edge.etype === etype
  );
  assert(targetEdgeDictList.length === 1);
  const targetEdgeDict = targetEdgeDictList[0];
  switch (posNeg) {
    case "pos":
      return targetEdgeDict.positive.length;
    case "neg":
      return targetEdgeDict.negative.length;
    default:
      console.log("invalid posNeg");
      return 0;
  }
};

type NodeEdgeNumProps = {
  miniBatchStats: MiniBatchStatsType;
};

const NodeEdgeNum: React.FC<NodeEdgeNumProps> = ({ miniBatchStats }) => {
  const ntypeList = getNtypeList(miniBatchStats);
  const etypeList = getEtypeList(miniBatchStats);

  const nodes = miniBatchStats.nodes;
  const edges = miniBatchStats.edges;

  const nodeChartsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "sampled num",
      },
    },
  };

  const edgeChartsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "sampled num",
      },
    },
  };

  const nodeChartsData = {
    labels: ntypeList,
    datasets: [
      {
        label: "positive",
        data: ntypeList.map((ntype: string) => numByNtype(nodes, ntype, 'pos')),
      },
      {
        label: "negative",
        data: ntypeList.map((ntype: string) => numByNtype(nodes, ntype, 'neg')),
      },
    ],
  };

  const edgeChartsData = {
    labels: etypeList,
    datasets: [
      {
        label: "positive",
        data: etypeList.map((etype: string) => numByEtype(edges, etype, 'pos')),
      },
      {
        label: "negative",
        data: etypeList.map((etype: string) => numByEtype(edges, etype, 'neg')),
      },
    ],
  };

  return (
    <>
      <Grid.Container>
        <Grid xs={6} css={{ w: "15vw", h: "20vw" }}>
          <Bar options={nodeChartsOptions} data={nodeChartsData} />
        </Grid>
        <Grid xs={6} css={{ w: "20vw", h: "20vw" }}>
          <Bar options={edgeChartsOptions} data={edgeChartsData} />
        </Grid>
      </Grid.Container>
    </>
  );
};


export default NodeEdgeNum;
