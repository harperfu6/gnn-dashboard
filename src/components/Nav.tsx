import { Navbar } from "@nextui-org/react";

const MyNavbar = () => {
  return (
    <Navbar isBordered variant="sticky" height={"5vh"}>
      <Navbar.Content>
        <Navbar.Link href="/">Home</Navbar.Link>
        <Navbar.Link href="/minibatch">MiniBatch</Navbar.Link>
      </Navbar.Content>
    </Navbar>
  );
};

export default MyNavbar;
