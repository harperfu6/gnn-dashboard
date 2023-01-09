import { Card, Dropdown, Grid, Spacer, Text } from "@nextui-org/react";
import { Chart as ChartJS, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
import useSWR from "swr";
import { Key, useState } from "react";
import { MiniBatchStatsType } from "../models/minibatchStats";
ChartJS.register(...registerables);

const binnig = (
  num_list: number[],
  min: number,
  max: number,
  interval: number
) => {
  const arrayLength = Math.round((max - min) / interval);
  let binnigList = Array.from({ length: arrayLength }, () => 0);
  const binnigRangeList = [...Array(arrayLength)].map(
    (_, i) => min + i * interval
  );

  num_list.forEach((num, n_i) => {
    binnigRangeList.forEach((binRange, r_i) => {
      if (num >= binnigRangeList[r_i + 1]) {
        binnigList[r_i + 1] = binnigList[r_i + 1] + 1;
      } else if (
        num >= binnigRangeList[r_i] &&
        num < binnigRangeList[r_i + 1]
      ) {
        binnigList[r_i] = binnigList[r_i] + 1;
      }
    });
  });

  return [binnigList, binnigRangeList];
};

const makeScoreData = (miniBatchStats: MiniBatchStatsType, etype: string) => {
  const [posScoreBinnigList, binnigRangeList] = binnig(
    miniBatchStats.pos_score[etype],
    0,
    1,
    0.1
  );
  const [negScoreBinnigList, _] = binnig(
    miniBatchStats.neg_score[etype],
    0,
    1,
    0.1
  );

  const scoreData = {
    labels: binnigRangeList.map((r) => r.toFixed(1)),
    datasets: [
      {
        label: "positive",
        data: posScoreBinnigList,
      },
      {
        label: "negative",
        data: negScoreBinnigList,
      },
    ],
  };

  return scoreData;
};

type MiniBatchStatsProps = {
  miniBatchStats: MiniBatchStatsType;
};

const MiniBatchStats: React.FC<MiniBatchStatsProps> = ({ miniBatchStats }) => {
  // TODO: miniBatchStatsから設定
  const defalutEtype = "app-user";
  const [selectedEtype1, setSelectedEtype1] = useState<string>(defalutEtype);
  const [selectedEtype2, setSelectedEtype2] = useState<string>(defalutEtype);

  const defalutScoreData = makeScoreData(miniBatchStats, defalutEtype);
  const [scoreData1, setScoreData1] = useState<object>(defalutScoreData);
  const [scoreData2, setScoreData2] = useState<object>(defalutScoreData);

  const loss = miniBatchStats.loss;
  const auc = miniBatchStats.auc;

  const etypeList = Object.keys(miniBatchStats.pos_score); // 代表して正例のリストからエッジ種別を取得

  const onSelectionChange1 = (keys: any) => {
    setSelectedEtype1(keys);
    setScoreData1(makeScoreData(miniBatchStats, keys));
  };

  const onSelectionChange2 = (keys: any) => {
    setSelectedEtype2(keys);
    setScoreData2(makeScoreData(miniBatchStats, keys));
  };

  const chartsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "score count",
      },
    },
  };

  return (
    <>
      <Grid.Container gap={2} justify="center">
        <Grid.Container gap={2}>
          <Grid xs={6}>
            <Card css={{ h: "$20" }}>
              <Card.Body>
                <Text size={"20px"}>Loss: {loss}</Text>
              </Card.Body>
            </Card>
          </Grid>
          <Grid xs={6}>
            <Card css={{ h: "$20" }}>
              <Card.Body>
                <Text size={"20px"}>AUC: {auc}</Text>
              </Card.Body>
            </Card>
          </Grid>
        </Grid.Container>
        <Spacer y={1} />
        <Grid.Container>
          <Grid xs={6} justify="center">
            <EtypeSelector
              etypeDictList={etypeList.map((etype: string) => ({
                key: etype,
                etype: etype,
              }))}
              selected={selectedEtype1}
              onSelectionChange={onSelectionChange1}
            />
          </Grid>
          <Grid xs={6} justify="center">
            <EtypeSelector
              etypeDictList={etypeList.map((etype: string) => ({
                key: etype,
                etype: etype,
              }))}
              selected={selectedEtype2}
              onSelectionChange={onSelectionChange2}
            />
          </Grid>
        </Grid.Container>
        <Grid.Container>
          <Grid xs={6} css={{ w: "20vw", h: "20vw" }}>
            <Bar options={chartsOptions} data={scoreData1} />
          </Grid>
          <Grid xs={6} css={{ w: "20vw", h: "20vw" }}>
            <Bar options={chartsOptions} data={scoreData2} />
          </Grid>
        </Grid.Container>
      </Grid.Container>
    </>
  );
};

type EtypeDict = {
  key: string;
  etype: string;
};

type EtypeSelectorProps = {
  etypeDictList: EtypeDict[];
  selected: string;
  onSelectionChange: (keys: Key) => void;
};

const EtypeSelector: React.FC<EtypeSelectorProps> = ({
  etypeDictList,
  selected,
  onSelectionChange,
}) => {
  return (
    <Dropdown>
      <Dropdown.Button flat>{selected}</Dropdown.Button>
      <Dropdown.Menu
        items={etypeDictList}
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selected}
        onAction={onSelectionChange}
      >
        {(item) => <Dropdown.Item key={item.key}>{item.etype}</Dropdown.Item>}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MiniBatchStats;
