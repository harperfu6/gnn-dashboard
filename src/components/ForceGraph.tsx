import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import { Object3D } from "three";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import {GraphData, MyLinkObject} from "../models/GraphData";


type MyForceGraph3DProps = {
  graphData: GraphData;
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
  return (
		<ForceGraph3D
      graphData={props.graphData}
      width={props.width}
      height={props.height}
      nodeLabel={props.nodeLabel}
      nodeAutoColorBy={props.nodeAutoColorBy}
      linkDirectionalArrowLength={props.linkDirectionalArrowLength}
      linkDirectionalArrowRelPos={props.linkDirectionalArrowRelPos}
      linkCurvature={props.linkCurvature}
      enableNodeDrag={props.enableNodeDrag}
      extraRenderers={[new CSS2DRenderer()]}
      linkWidth={props.linkWidth}
      nodeThreeObject={props.nodeThreeObject}
    />
  );
};


MyForceGraph3D.defaultProps = {
  width: 1000,
  height: 1000,
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
