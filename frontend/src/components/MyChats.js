import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text, StackDivider, Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender, getLastMessageContent } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./misc/GroupChatModal";
import { ChatState } from "../context/ChatProvider";
import { useColorMode } from "@chakra-ui/react";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();
  const { colorMode } = useColorMode();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg={colorMode === "dark" ? "gray.700" : "white"}
      w={{ base: "100%", md: "32%" }}
      mr={3}
      borderRadius="lg"
      boxShadow="base"
    >
      <Box
        pb={3}
        fontSize={{ base: "28px", md: "30px" }}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        fontWeight="medium"
        bg={colorMode === "dark" ? "gray.700" : "white"}
      >
        My Chats
        <GroupChatModal>
          <Button
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        bg={colorMode === "dark" ? "gray.800" : "#F6F8FB"}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack
            overflowY="scroll"
            spacing={0}
            divider={<StackDivider borderColor={colorMode === "dark" ? "#a8a7a7" : "grey.200"} />}
          >
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? (colorMode === "dark" ? "#5cb583" : "#fc839f") : (colorMode === "dark" ? "#2e3643" : "#eef2f7")}
                color={selectedChat === chat || colorMode === "dark" ? "white" : "black"}
                boxShadow={selectedChat === chat ? "inner" : "sm"}
                _hover={
                  selectedChat === chat
                    ? { bg: colorMode === "dark" ? "#6bb78d" : "#F35E80", transition: "0.3s" }
                    : { bg: colorMode === "dark" ? "#272d37" : "#E9ECF1", transition: "0.3s" }
                }
                px={3}
                py={2}
                key={chat._id}
              >
                <Text fontWeight="bold">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage ? (
                  <Text fontSize="xs" fontWeight="medium">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {getLastMessageContent(chat, loggedUser).length > 50
                      ? getLastMessageContent(chat, loggedUser).substring(
                        0,
                        51
                      ) + "..."
                      : getLastMessageContent(chat, loggedUser)}
                  </Text>
                ) : (
                  <Text fontSize="xs" fontWeight="medium">
                    No messages in this chat
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
