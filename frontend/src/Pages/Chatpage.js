import { Box } from "@chakra-ui/react";
import { useState } from "react";
import Chatbox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/misc/SideDrawer";
import { ChatState } from "../context/ChatProvider";
import { Button, Flex } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { useColorMode } from "@chakra-ui/react";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(true);
  const { user } = ChatState();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      w="100%"
      h="100vh"
      bg={colorMode === "dark" ? "black" : "#eef2f7"}
      color={colorMode === "dark" ? "white" : "black"}
      position="relative"
    >
      {user && <SideDrawer />}
      <Flex justifyContent="space-between" w="100%" h="90vh" p="10px">
        <Button
          onClick={toggleColorMode}
          position="fixed"
          bottom="1rem"
          left="1rem"
          bg={colorMode === "dark" ? "white" : "black"}
          color={colorMode === "dark" ? "black" : "white"}
          _hover={{
            bg: colorMode === "dark" ? "gray.200" : "gray.800",
          }}
          _active={{
            bg: colorMode === "dark" ? "gray.300" : "gray.700",
          }}
          border="2px"
          borderColor={colorMode === "dark" ? "white" : "black"}
          borderRadius="md"
          zIndex="999"
          outline="none"
        >
          {colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
        </Button>
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Flex>
    </Box>
  );
};

export default Chatpage;
