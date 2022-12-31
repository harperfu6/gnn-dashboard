import { LinkObject, NodeObject } from "react-force-graph-3d";

export type MyNodeObject = NodeObject & {
  group: number;
};

export type MyLinkObject = LinkObject & {
  value: number;
};

export type GraphData = {
  nodes: MyNodeObject[];
  links: MyLinkObject[];
};
