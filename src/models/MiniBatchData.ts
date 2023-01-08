export type MiniBatchStatsType = {
  pos_score: { [etype: string]: number[] };
  neg_score: { [etype: string]: number[] };
  loss: number;
  auc: number;
};

export type AllMiniBatchStatsType = {
  minibatch_id: string;
  loss: number;
  auc: number;
  sampled_num: { [posNeg: string]: { [node: string]: number } };
};
