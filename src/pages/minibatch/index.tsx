import { Key, useState } from "react";
import { MyNodeObject } from "../../models/GraphData";
import useSWR from "swr";
import {
  Card,
  Col,
  Container,
  Dropdown,
  Grid,
  Row,
  Spacer,
  Text,
} from "@nextui-org/react";
import NodeEdgeNum from "../../components/NodeEdgeNum";

import { Chart as ChartJS, registerables } from "chart.js";
import { AllMiniBatchStatsType } from "../../models/MiniBatchData";
import MiniBatchStats from "../../components/MiniBatchStats";
import Graph from "../graph";
ChartJS.register(...registerables);

const getEpochSampleIdList = (data: AllMiniBatchStatsType[]) => {
  const miniBatchIdList = data.map(
    (miniBatchStats: AllMiniBatchStatsType) => miniBatchStats.minibatch_id
  );
  const uniqueEpochIdList = Array.from(
    new Set(
      miniBatchIdList.map(
        (miniBatchIdList: string) => miniBatchIdList.split("-")[0]
      )
    )
  );
  const uniqueSampleIdList = Array.from(
    new Set(
      miniBatchIdList.map(
        (miniBatchIdList: string) => miniBatchIdList.split("-")[1]
      )
    )
  );
  const epochIdList = Array.from(
    { length: uniqueEpochIdList.length },
    (_, i) => `epoch-${i + 1}`
  );
  const sampleIdList = Array.from(
    { length: uniqueSampleIdList.length },
    (_, i) => `sample-${i}`
  );
  return { epochIdList: epochIdList, sampleIdList: sampleIdList };
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type MiniBatchStatsProps = {
  epochId: number;
  sampleId: number;
};

// useRouterで取得したepochIdとsampleIdをuseStateに初期値として設定できなかったのでpropsとして渡す
const MiniBatch: React.FC<MiniBatchStatsProps> = ({ epochId, sampleId }) => {
  const [selectedEpochId, setSelectedEpochId] = useState<string>(
    epochId ? `epoch-${epochId}` : ""
  );
  const [selectedSampleId, setSelectedSampleId] = useState<string>(
    `sample-${sampleId}`
  );

  const { data: graphData, error: graphDataError } = useSWR(
    epochId ? `/api/graph/${epochId}/${sampleId}` : null,
    fetcher
  );

  const { data: allMiniBatchStatsList, error: allMiniBatchIdError } = useSWR(
    `/api/minibatch_stats/`,
    fetcher
  );

  const { data: miniBatchStats, error: miniBatchStatsError } = useSWR(
    epochId ? `/api/minibatch_stats/${epochId}/${sampleId}` : null,
    fetcher
  );

  if (allMiniBatchIdError || miniBatchStatsError || graphDataError)
    return <div>failed to load</div>;
  if (!allMiniBatchStatsList || !miniBatchStats || !graphData)
    return <div>loading...</div>;

  const { epochIdList, sampleIdList } = getEpochSampleIdList(
    allMiniBatchStatsList
  );

  const onEpochIdSelectionChange = (keys: any) => {
    setSelectedEpochId(keys);
  };

  const onSampleIdSelectionChange = (keys: any) => {
    setSelectedSampleId(keys);
  };

  return (
    <>
      <Grid.Container>
        <Grid xs={6}>
          <Grid.Container>
            <Grid xs={12}>
              <IdSelector
                idDictList={epochIdList.map((epochId: string) => ({
                  key: epochId,
                  id: epochId,
                }))}
                selected={selectedEpochId}
                onSelectionChange={onEpochIdSelectionChange}
              />
              <IdSelector
                idDictList={sampleIdList.map((sampleId: string) => ({
                  key: sampleId,
                  id: sampleId,
                }))}
                selected={selectedSampleId}
                onSelectionChange={onSampleIdSelectionChange}
              />
            </Grid>
            <Grid xs={12}>
              <MiniBatchStats miniBatchStats={miniBatchStats} />
            </Grid>
            <Grid xs={12}>
              <NodeEdgeNum graphData={graphData} />
            </Grid>
          </Grid.Container>
        </Grid>
        <Grid xs={6}>
          <Graph graphData={graphData} />
        </Grid>
      </Grid.Container>
    </>
  );
};

type idDict = {
  key: string;
  id: string;
};

type IdSelectorProps = {
  idDictList: idDict[];
  selected: string;
  onSelectionChange: (keys: Key) => void;
};

const IdSelector: React.FC<IdSelectorProps> = ({
  idDictList,
  selected,
  onSelectionChange,
}) => {
  return (
    <Dropdown>
      <Dropdown.Button flat>{selected}</Dropdown.Button>
      <Dropdown.Menu
        items={idDictList}
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selected}
        onAction={onSelectionChange}
      >
        {(item) => <Dropdown.Item key={item.key}>{item.id}</Dropdown.Item>}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const MiniBatchStatsMain = () => {
  return <MiniBatch epochId={1} sampleId={0} />;
};

export default MiniBatchStatsMain;
