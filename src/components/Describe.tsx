import { Grid } from "@nextui-org/react";
import { Bar } from "react-chartjs-2";
import { GraphData, MyLinkObject, MyNodeObject } from "../models/GraphData";

const numByNtype = (nodes: MyNodeObject[], ntype: string): number => {
  return nodes.filter((myNode: MyNodeObject) => myNode.ntype === ntype).length;
};

const numByEtype = (edges: MyLinkObject[], etype: string): number => {
  return edges.filter((myLink: MyLinkObject) => myLink.etype === etype).length;
};

type DescribeProps = {
  graphData: GraphData;
};

const Describe: React.FC<DescribeProps> = ({ graphData }) => {
  const nodes = graphData.nodes;
  const links = graphData.links;

  const nodeNum = nodes.length;
  const linkNum = links.length;

  const ntypeList = graphData.ntype;
  const etypeList = graphData.etype;

  const nodeChartsOptions = {
    responsive: true,
    indexAxis: "y",
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `count by node type (all num: ${nodeNum})`,
      },
    },
  };

  const edgeChartsOptions = {
    responsive: true,
    indexAxis: "y",
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `count by node type (all num: ${linkNum})`,
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
        <Grid xs={6}>
          <Bar options={nodeChartsOptions} data={nodeChartsData} />
        </Grid>
        <Grid xs={6}>
          <Bar options={edgeChartsOptions} data={edgeChartsData} />
        </Grid>
      </Grid.Container>
    </>
  );
};

export default Describe;
