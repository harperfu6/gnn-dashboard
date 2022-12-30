import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import { GraphData, MyLinkObject } from "../components/ForceGraph";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import useSWR from "swr";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

const MyForceGraph3D = dynamic(() => import('../components/ForceGraph'), {
  ssr: false,
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Home = () => {
  const { data, error } = useSWR("/api/graphs", fetcher);
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

export default Home;
