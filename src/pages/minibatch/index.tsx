import { Key, useState } from "react";
import useSWR from "swr";
import { Dropdown, Grid } from "@nextui-org/react";
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
    (_, i) => i + 1
  );
  const sampleIdList = Array.from(
    { length: uniqueSampleIdList.length },
    (_, i) => i
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
  const { data: graphData, error: graphDataError } = useSWR(
    epochId ? `/api/graph/${epochId}/${sampleId}` : null,
    fetcher
  );

  const { data: miniBatchStats, error: miniBatchStatsError } = useSWR(
    epochId ? `/api/minibatch_stats/${epochId}/${sampleId}` : null,
    fetcher
  );

  if (miniBatchStatsError || graphDataError) return <div>failed to load</div>;
  if (!miniBatchStats || !graphData) return <div>loading...</div>;

  return (
    <>
      <Grid.Container>
        <Grid xs={6}>
          <Grid.Container>
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
  key: number;
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
  const [epochId, setEpochId] = useState<number>(1);
  const [sampleId, setSampleId] = useState<number>(0);

  const { data: allMiniBatchStatsList, error: allMiniBatchIdError } = useSWR(
    `/api/minibatch_stats/`,
    fetcher
  );

  if (allMiniBatchIdError) return <div>failed to load</div>;
  if (!allMiniBatchStatsList) return <div>loading...</div>;

  const { epochIdList, sampleIdList } = getEpochSampleIdList(
    allMiniBatchStatsList
  );

  const onEpochIdSelectionChange = (keys: any) => {
    setEpochId(keys);
  };

  const onSampleIdSelectionChange = (keys: any) => {
    setSampleId(keys);
  };

  return (
    <Grid.Container>
      <Grid xs={12}>
        <IdSelector
          idDictList={epochIdList.map((epochId: number) => ({
            key: epochId,
            id: `epoch-${epochId}`,
          }))}
          selected={`epoch-${epochId}`}
          onSelectionChange={onEpochIdSelectionChange}
        />
        <IdSelector
          idDictList={sampleIdList.map((sampleId: number) => ({
            key: sampleId,
            id: `sample-${sampleId}`,
          }))}
          selected={`sample-${sampleId}`}
          onSelectionChange={onSampleIdSelectionChange}
        />
      </Grid>
      <Grid xs={12}>
        <MiniBatch epochId={epochId} sampleId={sampleId} />
      </Grid>
    </Grid.Container>
  );
};

export default MiniBatchStatsMain;
