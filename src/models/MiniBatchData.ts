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

export type DetaileMiniBatchStatsType = {
  score: MiniBatchScoreType[];
  nodes: NodeDict[];
  edges: EdgeDict[];
  loss: number;
  auc: number;
};

export type SampledNumType = {
  ntype: string;
  source_target: string;
  pos: { [node: string]: number };
  neg: { [node: string]: number };
};

export type SimpleMiniBatchStatsType = {
  minibatch_id: string;
  loss: number;
  auc: number;
  sampled_num: SampledNumType[];
};
