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
  minibatch_id: string;
  score: MiniBatchScoreType[];
  nodes: NodeDict[];
  edges: EdgeDict[];
  loss: number;
  auc: number;
};

export type SampledNumDictType = {
  nodeName: string;
  sourceSampledNum: number;
  targetSampledNum: number;
};

export type NtypeSampledNumDictType = {
  ntype: string;
  sampledNumDictList: SampledNumDictType[];
};

export type SimpleMiniBatchStatsType = {
  minibatchIdList: string[];
  lossList: number[];
  aucList: number[];
  posSampledNumList: NtypeSampledNumDictType[];
  negSampledNumList: NtypeSampledNumDictType[];
};


