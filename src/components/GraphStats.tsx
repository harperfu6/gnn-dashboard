import { GraphData } from "../models/GraphData";

type GraphStatsProps = {
  graphData: GraphData;
};

const GraphStats = (props: GraphStatsProps) => {
  const nodes = props.graphData.nodes;
  const links = props.graphData.links;

  const nodeNum = nodes.length;
  const linkNum = links.length;

  return (
    <>
      <div>node num: {nodeNum}</div>
      <div>edge num: {linkNum}</div>
    </>
  );
};

export default GraphStats;
