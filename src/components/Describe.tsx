import {GraphData} from "../models/GraphData";

type DescribeProps = {
  graphData: GraphData;
};

const Describe = (props: DescribeProps) => {
  const graphData = props.graphData;
  const nodes = graphData.nodes;
  const links = graphData.links;

  const nodeNum = nodes.length;
  const linkNum = links.length;
  return (
    <>
      <div>node num: {nodeNum}</div>
      <div>edge num: {linkNum}</div>
    </>
  );
};


export default Describe;
