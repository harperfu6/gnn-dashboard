import { Grid } from "@nextui-org/react";
import { Bar } from "react-chartjs-2";
import { GraphData, MyLinkObject, MyNodeObject } from "../models/GraphData";

const numByNtype = (nodes: MyNodeObject[], ntype: string): number => {
  return nodes.filter((myNode: MyNodeObject) => myNode.ntype === ntype).length;
};

const numByEtype = (edges: MyLinkObject[], etype: string): number => {
  return edges.filter((myLink: MyLinkObject) => myLink.etype === etype).length;
};

type NodeEdgeNumProps = {
  graphData: GraphData;
};

const NodeEdgeNum: React.FC<NodeEdgeNumProps> = ({ graphData }) => {
  const nodes = graphData.nodes;
  const links = graphData.links;

  const nodeNum = nodes.length;
  const linkNum = links.length;

  const ntypeList = graphData.ntype;
  const etypeList = graphData.etype;

  const nodeChartsOptions = {
    responsive: true,
    indexAxis: "y",
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `sampled num by node type (all num: ${nodeNum})`,
      },
    },
  };

  const edgeChartsOptions = {
    responsive: true,
    indexAxis: "y",
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `sampled num by edge type (all num: ${linkNum})`,
      },
    },
  };

  const nodeChartsData = {
    labels: ntypeList,
    datasets: [
      {
        label: "count",
        data: ntypeList.map((ntype: string) => numByNtype(nodes, ntype)),
      },
    ],
  };

  const edgeChartsData = {
    labels: etypeList,
    datasets: [
      {
        label: "count",
        data: etypeList.map((etype: string) => numByEtype(links, etype)),
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
