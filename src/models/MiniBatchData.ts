export type EdgeScoreType = {
  score: number[];
  source_node_id: string[];
  target_node_id: string[];
};

export type MiniBatchScoreType = {
  etype: string;
  pos_score: EdgeScoreType;
  neg_score: EdgeScoreType;
};

export type NodeDict = {
  ntype: string;
  positive: string[];
  negative: string[];
};

export type EdgeDict = {
  etype: string;
  positive: string[];
  negative: string[];
};

export type MiniBatchStatsType = {
  score: MiniBatchScoreType[];
  nodes: NodeDict[];
  edges: EdgeDict[];
  loss: number;
  auc: number;
};

export type AllMiniBatchStatsType = {
  minibatch_id: string;
  loss: number;
  auc: number;
  sampled_num: { [posNeg: string]: { [node: string]: number } };
};
