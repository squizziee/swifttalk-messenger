import { Box } from "@chakra-ui/react";
import { useState } from "react";
import Chatbox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/misc/SideDrawer";
import { ChatState } from "../context/ChatProvider";
import { Flex } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(true);
  const { user } = ChatState();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      w="100%"
      h="100vh"
      bg={colorMode === "dark" ? "gray.800" : "#eef2f7"}
      color={colorMode === "dark" ? "white" : "black"}
      position="relative"
    >
      {user && <SideDrawer />}
      <Flex justifyContent="space-between" w="100%" h="90vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Flex>
    </Box>
  );
};

export default Chatpage;
