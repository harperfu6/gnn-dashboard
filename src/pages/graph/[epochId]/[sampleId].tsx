import { useRouter } from "next/router";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { GraphData, MyLinkObject } from "../../../models/GraphData";
import GraphStats from "../../../components/GraphStats";

const MyForceGraph3D = dynamic(() => import("../../../components/ForceGraph"), {
  ssr: false,
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Graph = () => {
  const router = useRouter();
  const { epochId, sampleId } = router.query;

  const { data, error } = useSWR(epochId ? `/api/graph/${epochId}/${sampleId}` : null, fetcher);
  const graphData: GraphData = data;

  const forceGraphViewWidth = 1000;
  const forceGraphViewHeight = 1000;

  const linkWidth = (link: MyLinkObject): number => {
    return link.value * 2;
  };

  const nodeThreeObject = (node: any) => {
    const nodeEl = document.createElement("div");
    nodeEl.textContent = node.id;
    nodeEl.style.fontSize = "12px";

    if (node.group == 99) {
      nodeEl.style.color = "white";
    } else if (node.group == 0) {
      // app
      nodeEl.style.color = "orange";
    } else if (node.group == 1) {
      // dpay
      nodeEl.style.color = "yellow";
    } else if (node.group == 2) {
      // staypoint
      nodeEl.style.color = "green";
    } else if (node.group == 3) {
      // dmenu
      nodeEl.style.color = "purple";
    }

    if (node.id == "user_17") {
      nodeEl.style.color = "red";
    }

    return new CSS2DObject(nodeEl);
  };

  if (error) return <div>Failed to load</div>;
  if (!graphData) return <div>Loading...</div>;

  return (
    <>
      <GraphStats graphData={graphData} />
      ===
      <MyForceGraph3D
        graphData={graphData}
        width={forceGraphViewWidth}
        height={forceGraphViewHeight}
        linkWidth={linkWidth}
        nodeThreeObject={nodeThreeObject}
      />
    </>
  );
};

export default Graph;
