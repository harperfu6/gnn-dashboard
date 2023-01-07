import { LinkObject, NodeObject } from "react-force-graph-3d";

export type MyNodeObject = NodeObject & {
  group: number;
	ntype: string;
};

export type MyLinkObject = LinkObject & {
  value: number;
	etype: string;
};

export type GraphData = {
	ntype: string[];
	etype: string[];
  nodes: MyNodeObject[];
  links: MyLinkObject[];
};
