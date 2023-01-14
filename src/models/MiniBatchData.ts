type EdgeScoreType = {
  score: number[];
  source_node_id: number[];
  target_node_id: number[];
};

export type MiniBatchStatsType = {
  pos_score: { [etype: string]: EdgeScoreType };
  neg_score: { [etype: string]: EdgeScoreType };
  loss: number;
  auc: number;
};

export type AllMiniBatchStatsType = {
  minibatch_id: string;
  loss: number;
  auc: number;
  sampled_num: { [posNeg: string]: { [node: string]: number } };
};
