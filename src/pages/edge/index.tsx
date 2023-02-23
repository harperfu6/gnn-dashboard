import Heatmap from "../../components/Heatmap";
import { DetaileMiniBatchStatsType } from "../../models/MiniBatchData";
import { fetcher } from "../../utils";
import useSWR from "swr";
import { useContext } from "react";
import { ExexuteIdContext } from "../../context";
import * as _ from "underscore";
import { binnig } from "../../utils";
import {transpose} from "underscore";

const etype = "app-user";
const sourceNodeId = "12";


const makeHeatmap2dArray = (
  detailStatsList: DetaileMiniBatchStatsType[],
  etype: string,
  sourceNodeId: string
) => {
  const makeScoreList = (
    detailStats: DetaileMiniBatchStatsType,
    posNeg: string
  ) => {
    let scoreList: number[];
    const _makeScoreList = (posNeg: string): number[] => {
      const _targetEtypeScoreList = detailStats.score.filter(
        (scoreDict) => scoreDict.etype == etype
      )[0];
      if (posNeg == "pos") {
        // source_node_idが取得対象のnode_idである場合を正とするリストの作成
        const _targetDataFilterList =
          _targetEtypeScoreList.pos_score.source_node_id.map((id: string) =>
            true ? id == sourceNodeId : false
          );
        // pos_scoreについて作成
        const _scoreList = _targetEtypeScoreList.pos_score.score;
        // 正負リストを使った該当のスコアを取得
        const scoreListWithFilter = _.zip(_scoreList, _targetDataFilterList);
        scoreList = scoreListWithFilter
          .filter((scoreWithFilter) => scoreWithFilter[1] == 1)
          .map((scoreWithFilter) => scoreWithFilter[0]);
        // 正負リストを使った該当の相手ノードを取得
        const nodeIdListWithFilter = _.zip(
          _targetEtypeScoreList.pos_score.target_node_id,
          _targetDataFilterList
        );
        const pairNodeList = nodeIdListWithFilter
          .filter((nodeIdWithFilter) => nodeIdWithFilter[1] == 1)
          .map((nodeIdWithFilter) => nodeIdWithFilter[0]);
      } else if (posNeg == "neg") {
        // source_node_idが取得対象のnode_idである場合を正とするリストの作成
        const _targetDataFilterList =
          _targetEtypeScoreList.neg_score.source_node_id.map((id: string) =>
            true ? id == sourceNodeId : false
          );
        // pos_scoreについて作成
        const _scoreList = _targetEtypeScoreList.neg_score.score;
        // 正負リストを使った該当のスコアを取得
        const scoreListWithFilter = _.zip(_scoreList, _targetDataFilterList);
        scoreList = scoreListWithFilter
          .filter((scoreWithFilter) => scoreWithFilter[1] == 1)
          .map((scoreWithFilter) => scoreWithFilter[0]);
        // 正負リストを使った該当の相手ノードを取得
        const nodeIdListWithFilter = _.zip(
          _targetEtypeScoreList.neg_score.target_node_id,
          _targetDataFilterList
        );
        const pairNodeList = nodeIdListWithFilter
          .filter((nodeIdWithFilter) => nodeIdWithFilter[1] == 1)
          .map((nodeIdWithFilter) => nodeIdWithFilter[0]);
      } else {
        console.log("[warning] pos or neg");
      }
      return scoreList;
    };
    return _makeScoreList(posNeg);
  };

  const posScoreList = detailStatsList.reduce(
    (allScoreList: number[][], detailStats: DetaileMiniBatchStatsType) => {
      allScoreList.push(makeScoreList(detailStats, "pos"));
      return allScoreList;
    },
    []
  );

  const negScoreList = detailStatsList.reduce(
    (allScoreList: number[][], detailStats: DetaileMiniBatchStatsType) => {
      allScoreList.push(makeScoreList(detailStats, "neg"));
      return allScoreList;
    },
    []
  );

  const binnigPosScoreList = posScoreList.map((_posScoreList: number[]) =>
    binnig(_posScoreList, 0, 1, 0.1)[0]
	);
  const binnigNegScoreList = negScoreList.map((_negScoreList: number[]) =>
    binnig(_negScoreList, 0, 1, 0.1)[0]
	);

  return [transpose(binnigPosScoreList), binnigNegScoreList];
};

const EdgeStats: React.FC = () => {
  {
    /* const { executeId, setExecuteId } = useContext(ExexuteIdContext); */
  }
  {/* const executeId = "dummy_data"; */}
  const executeId = "all-reversed-edge";

  const { data: detailStatsList, error: miniBatchStatsError } = useSWR<
    DetaileMiniBatchStatsType[],
    Error
  >(`/api/edge_score/${executeId}/`, fetcher);

  if (miniBatchStatsError) return <div>failed to load</div>;
  if (!detailStatsList) return <div>loading...</div>;

  const [binnigPosScoreList, binnigNegScoreList] = makeHeatmap2dArray(detailStatsList, etype, sourceNodeId);

  return <> <Heatmap heatmap2dArray={binnigPosScoreList} /> </>;
};

export default EdgeStats;
