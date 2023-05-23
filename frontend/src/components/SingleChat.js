import { FormControl } from "@chakra-ui/form-control";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import React from "react";
import { useRef } from 'react';
import { IconButton, Spinner, useToast, Flex, VisuallyHidden } from "@chakra-ui/react";
import { getSender, getSenderFull, getPassphraseOfOtherUser } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import ProfileModal from "./misc/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import io from "socket.io-client";
import UpdateGroupChatModal from "./misc/UpdateGroupChatModal";
import { ChatState } from "../context/ChatProvider";
import CryptoJS from "crypto-js";
import { Button } from "@chakra-ui/button";

const { AES } = CryptoJS;
const createECDH = require('create-ecdh/browser')
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [file, setFile] = useState();
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [needChatUpdate, setNeedChatUpdate] = useState(false);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      const response = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      const { data } = response;
      if (!selectedChat.isGroupChat) {
        const publicKeyOfOtherUserStr = getSenderFull(user, selectedChat.users).publicKey;
        const passphraseOfOtherUser = getPassphraseOfOtherUser(publicKeyOfOtherUserStr);
        data.forEach(message => {
          message.content = AES.decrypt(message.content, passphraseOfOtherUser).toString(
            CryptoJS.enc.Utf8
          );
        });
      }
      setMessages(data);
      console.log(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        if (!selectedChat.isGroupChat) {
          const publicKeyOfOtherUserStr = getSenderFull(user, selectedChat.users).publicKey;
          const passphraseOfOtherUser = getPassphraseOfOtherUser(publicKeyOfOtherUserStr);
          const newMessage1 = AES.encrypt(newMessage, passphraseOfOtherUser).toString();
          setNewMessage("");
          const { data } = await axios.post(
            "/api/message",
            {
              content: newMessage1,
              chatId: selectedChat,
            },
            config
          );
          data.content = AES.decrypt(data.content, passphraseOfOtherUser).toString(
            CryptoJS.enc.Utf8
          );

          socket.emit("new message", data);
          setMessages([...messages, data]);
        } else {
          setNewMessage("");
          const { data } = await axios.post(
            "/api/message",
            {
              content: newMessage,
              chatId: selectedChat,
            },
            config
          );
          socket.emit("new message", data);
          setMessages([...messages, data]);
        }
      } catch (error) {
        console.log(error);
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);
  useEffect(() => {
    socket.on("update chat", () => { needChatUpdate(true); console.log("lj;") });
  }, []);

  useEffect(() => {
    console.log("dfgkhjnhdf");
    fetchMessages();
    socket.emit("update chat", selectedChat);
    setNeedChatUpdate(false);
    console.log("dfgkhjnhdf");
  }, [needChatUpdate]);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 1000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    sendFile();
  }, [file]);

  const sendFile = async () => {
    if (!selectedChat) return;
    try {
      const message = "Share with you my file:"
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      if (!selectedChat.isGroupChat) {
        const publicKeyOfOtherUserStr = getSenderFull(user, selectedChat.users).publicKey;
        const passphraseOfOtherUser = getPassphraseOfOtherUser(publicKeyOfOtherUserStr);
        const newMessage1 = AES.encrypt(message, passphraseOfOtherUser).toString();
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage1,
            chatId: selectedChat,
          },
          config
        );
        await axios.post(
          `/api/message/file`,
          {
            filename: file.format,
            size: (file.bytes / 1024),
            url: file.url,
            messageId: data._id,
          },
          config
        );
        const lastMessage = await axios.get(
          `/api/message/get/${data._id}`,
          config
        );
        console.log(lastMessage.data[0].content);
        lastMessage.data[0].content = AES.decrypt(lastMessage.data[0].content, passphraseOfOtherUser).toString(
          CryptoJS.enc.Utf8
        );
        console.log(lastMessage.data[0]);
        socket.emit("new message", lastMessage.data[0]);
        setMessages([...messages, lastMessage.data[0]]);
      } else {
        const { data } = await axios.post(
          "/api/message",
          {
            content: message,
            chatId: selectedChat,
          },
          config
        );
        await axios.post(
          `/api/message/file`,
          {
            filename: file.format,
            size: (file.bytes / 1024),
            url: file.url,
            messageId: data._id,
          },
          config
        );
        const lastMessage = await axios.get(
          `/api/message/get/${data._id}`,
          config
        );
        console.log(lastMessage.data[0]);
        socket.emit("new message", lastMessage.data[0]);
        setMessages([...messages, lastMessage.data[0]]);
      }
      toast({
        title: "Send File",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to send the File",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const postDetails = (file) => {
    if (file === undefined) {
      toast({
        title: "Please select a file",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "application/x-7z-compressed" ||
      file.type === "text/x-c++src" ||
      file.type === "application/x-zip-compressed" ||
      file.type === "application/pdf") {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "swifttalk-messenger");
      data.append("cloud_name", "dtcs5od9f");
      fetch("https://api.cloudinary.com/v1_1/dtcs5od9f/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setFile(data);
          console.log(data);
          console.log(data.format);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(data);
      toast({
        title: "Send File",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } else {
      toast({
        title: "Please select a file",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    postDetails(file);
  };

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            w="100%"
            fontWeight="medium"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<i class="fa-solid fa-arrow-left"></i>}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#F6F8FB"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} setNeedChatUpdate={setNeedChatUpdate} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
              display="flex"
              alignItems="center"
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <InputGroup>
              <InputLeftElement>
                <i class="far fa-comment" style={{color:'gray'}}></i>
              </InputLeftElement>
              <Input
                variant="filled"
                bg="#eef2f7"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
                focusBorderColor='#fc839f'
                flex="1"
                marginRight={2}
              />
              </InputGroup>
              <Flex alignItems="center">
                <Box as="label" htmlFor="file-input">
                  <VisuallyHidden>
                    <Input
                      id="file-input"
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                  </VisuallyHidden>
                  <IconButton
                    width="100%"
                    onClick={handleChooseFile}
                    icon={<i class="far fa-file" style={{color:'gray'}}></i>}
                  />
                </Box>
              </Flex>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
