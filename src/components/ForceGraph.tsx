import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import { Object3D } from "three";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { GraphData, MyLinkObject, MyNodeObject } from "../models/GraphData";

type MyForceGraph3DProps = {
  graphData: GraphData;
  selectedNodeObject: MyNodeObject;
  width: number;
  height: number;
  nodeLabel: string;
  nodeAutoColorBy: string;
  linkDirectionalArrowLength: number; // 有向グラフの矢印の大きさ
  linkDirectionalArrowRelPos: number; // 有向グラフの矢印の位置
  linkCurvature: number; // エッジのカーブ（主に双方向グラフで使用）
  enableNodeDrag: boolean; // ノードをドラッグで動かせるようにするか
  linkWidth: (link: MyLinkObject) => number;
  nodeThreeObject: (node: any) => Object3D<Event>; // カスタムノード
};

const MyForceGraph3D = (props: MyForceGraph3DProps) => {
  const viewWidth = 1000;
  const viewHeight = 1000;

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

    if (props.selectedNodeObject && node.id == props.selectedNodeObject.id) {
      nodeEl.style.color = "red";
    }

    return new CSS2DObject(nodeEl);
  };

  {/* return ( */}
  {/*   <ForceGraph3D */}
  {/*     graphData={props.graphData} */}
  {/*     width={viewWidth} */}
  {/*     height={viewHeight} */}
  {/*     nodeLabel={props.nodeLabel} */}
  {/*     nodeAutoColorBy={props.nodeAutoColorBy} */}
  {/*     linkDirectionalArrowLength={props.linkDirectionalArrowLength} */}
  {/*     linkDirectionalArrowRelPos={props.linkDirectionalArrowRelPos} */}
  {/*     linkCurvature={props.linkCurvature} */}
  {/*     enableNodeDrag={props.enableNodeDrag} */}
  {/*     extraRenderers={[new CSS2DRenderer()]} */}
  {/*     linkWidth={linkWidth} */}
  {/*     nodeThreeObject={nodeThreeObject} */}
  {/*   /> */}
  {/* ); */}
	return (
    <ForceGraph3D
    />
	)
};

MyForceGraph3D.defaultProps = {
  nodeLabel: "id",
  nodeAutoColorBy: "group",
  linkDirectionalArrowLength: 4, // 有向グラフの矢印の大きさ
  linkDirectionalArrowRelPos: 1, // 有向グラフの矢印の位置
  linkCurvature: 0.25, // エッジのカーブ（主に双方向グラフで使用）
  enableNodeDrag: false, // ノードをドラッグで動かせるようにするか
  linkWidth: 1,
  nodeThreeObject: () => {
    const nodeEl = document.createElement("div");
    return new CSS2DObject(nodeEl);
  },
};

export default MyForceGraph3D;
