import { Dropdown, Navbar } from "@nextui-org/react";
import { Dispatch, SetStateAction, useState } from "react";
import useSWR from "swr";
import { fetcher } from "../utils";

type ExexuteIdMenuProps = MyNavbarProps & {
  executeIdList: string[];
};

const ExexuteIdMenu: React.FC<ExexuteIdMenuProps> = ({
  executeIdList,
  executeId,
  setExecuteId,
}) => {
  const [selectedExecuteId, setSelectedExecuteId] = useState(executeId);

  const onSelectionChange = (keys: any) => {
    setSelectedExecuteId(keys);
    setExecuteId([...keys][0]); // get from Set Object
  };

  return (
    <Dropdown>
      <Dropdown.Button flat>{executeId}</Dropdown.Button>
      <Dropdown.Menu
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedExecuteId}
        onSelectionChange={onSelectionChange}
      >
        {executeIdList.map((executeId) => (
          <Dropdown.Item key={executeId}>{executeId}</Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

type MyNavbarProps = {
  executeId: string;
  setExecuteId: Dispatch<SetStateAction<string>>;
};

const MyNavbar: React.FC<MyNavbarProps> = ({ executeId, setExecuteId }) => {
  const { data: executeIdList, error } = useSWR(
    `/api/execute-id-list`,
    fetcher
  );
  if (error) return <div>failed to load</div>;
  if (!executeIdList) return <div>loading...</div>;

  if (executeId === "") {
    setExecuteId(executeIdList[0]);
  }

  return (
    <Navbar isBordered variant="sticky" height={"5vh"}>
      <Navbar.Content>
        <Navbar.Link href="/">Home</Navbar.Link>
        <Navbar.Link href="/minibatch">MiniBatch</Navbar.Link>
      </Navbar.Content>
      <Navbar.Content>
        <ExexuteIdMenu
          executeIdList={executeIdList}
          executeId={executeId}
          setExecuteId={setExecuteId}
        />
      </Navbar.Content>
    </Navbar>
  );
};

export default MyNavbar;
