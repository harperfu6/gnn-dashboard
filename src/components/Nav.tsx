import { Dropdown, Navbar } from "@nextui-org/react";
import { Dispatch, SetStateAction } from "react";

type ExexuteIdMenuProps = {
  executeIdList: string[];
  executeId: string;
  setExecuteId: Dispatch<SetStateAction<string>>;
};

type MyNavbarProps = ExexuteIdMenuProps;

const ExexuteIdMenu: React.FC<ExexuteIdMenuProps> = ({
  executeIdList,
  executeId,
  setExecuteId,
}) => {
  return (
    <Dropdown>
      <Dropdown.Button flat>{executeId}</Dropdown.Button>
      <Dropdown.Menu
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={executeId}
        onSelectionChange={setExecuteId}
      >
        {executeIdList.map((executeId) => (
          <Dropdown.Item key={executeId}>{executeId}</Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const MyNavbar: React.FC<MyNavbarProps> = ({
  executeIdList,
  executeId,
  setExecuteId,
}) => {
  return (
    <Navbar isBordered variant="sticky" height={"5vh"}>
      <Navbar.Content>
        <Navbar.Link href="/">Home</Navbar.Link>
        <Navbar.Link href="/minibatch">MiniBatch</Navbar.Link>
      </Navbar.Content>
    </Navbar>
  );
};


      {/* <Navbar.Content> */}
      {/*   <ExexuteIdMenu */}
      {/*     executeIdList={executeIdList} */}
      {/*     executeId={executeId} */}
      {/*     setExecuteId={setExecuteId} */}
      {/*   /> */}
      {/* </Navbar.Content> */}
export default MyNavbar;
