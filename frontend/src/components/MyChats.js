import React from "react";
import { ChatState } from "../context/ChatProvider";
import { useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const { setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

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
  }, []);

  return <div>MyChats</div>;
};

export default MyChats;
