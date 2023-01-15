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

export type MiniBatchStatsType = {
  score: MiniBatchScoreType[];
  loss: number;
  auc: number;
};

export type AllMiniBatchStatsType = {
  minibatch_id: string;
  loss: number;
  auc: number;
  sampled_num: { [posNeg: string]: { [node: string]: number } };
};
