import { Key, useContext, useState } from "react";
import useSWR from "swr";
import { Dropdown, Grid } from "@nextui-org/react";
import NodeEdgeNum from "../../components/NodeEdgeNum";

import { Chart as ChartJS, registerables } from "chart.js";
import MiniBatchStats from "../../components/MiniBatchStats";
import MyNavbar from "../../components/Nav";
import { ExexuteIdContext } from "../../context";
import EdgeScore from "./edge";
import { DetaileMiniBatchStatsType } from "../../models/MiniBatchData";
ChartJS.register(...registerables);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type MiniBatchStatsProps = {
  epochId: number;
  sampleId: number;
};

// useRouterで取得したepochIdとsampleIdをuseStateに初期値として設定できなかったのでpropsとして渡す
const MiniBatch: React.FC<MiniBatchStatsProps> = ({ epochId, sampleId }) => {
  const { executeId, setExecuteId } = useContext(ExexuteIdContext);

  const { data: miniBatchStats, error: miniBatchStatsError } = useSWR<
    DetaileMiniBatchStatsType,
    Error
  >(
    epochId ? `/api/minibatch_stats/${executeId}/${epochId}/${sampleId}` : null,
    fetcher
  );

  if (!miniBatchStats) return <div>loading...</div>;

  return (
    <>
      <Grid.Container>
        <Grid xs={6} css={{ padding: "20px" }}>
          <Grid.Container>
            <Grid xs={12}>
              <MiniBatchStats miniBatchStats={miniBatchStats} />
            </Grid>
            <Grid xs={12}>
              <NodeEdgeNum miniBatchStats={miniBatchStats} />
            </Grid>
          </Grid.Container>
        </Grid>
        <Grid xs={6} css={{ padding: "20px" }}>
          <EdgeScore miniBatchStats={miniBatchStats} />
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
  const { executeId, setExecuteId } = useContext(ExexuteIdContext);

  const [epochId, setEpochId] = useState<number>(1);
  const [sampleId, setSampleId] = useState<number>(0);

  // simple_stats.jsonから取得しても良いが、ファイルの中身を取得する必要があるためファイル名から取得する
  const { data: epochSampleIdDict, error } = useSWR(
    `/api/minibatch_stats/${executeId}/epoch-sample-id-list`,
    fetcher
  );

  if (error) return <div>failed to load minibatch_stats</div>;
  if (!epochSampleIdDict) return <div>loading...</div>;

  const { epochIdList, sampleIdList } = epochSampleIdDict;

  const onEpochIdSelectionChange = (keys: any) => {
    setEpochId(keys);
  };

  const onSampleIdSelectionChange = (keys: any) => {
    setSampleId(keys);
  };

  return (
    <>
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
    </>
  );
};

// TODO: NEED TO REFACTORING!!!
const MiniBatchStatsEntry = () => {
  const { executeId, setExecuteId } = useContext(ExexuteIdContext);

  return (
    <>
      <MyNavbar executeId={executeId} setExecuteId={setExecuteId} />
      <MiniBatchStatsMain />
    </>
  );
};

export default MiniBatchStatsEntry;
