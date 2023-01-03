export type MiniBatchStats = {
  pos_score: { [etype: string]: number[] };
  neg_score: { [etype: string]: number[] };
  loss: number;
  auc: number;
};
