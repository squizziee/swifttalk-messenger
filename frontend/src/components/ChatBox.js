import { Box } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import SingleChat from "./SingleChat";
import { ChatState } from "../context/ChatProvider";
import { useColorMode } from "@chakra-ui/react";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  const { colorMode } = useColorMode();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg={colorMode === "dark" ? "gray.700" : "white"}
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      boxShadow="base"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
