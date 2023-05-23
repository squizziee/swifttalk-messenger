import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
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
const { AES } = CryptoJS;
const createECDH = require('create-ecdh/browser')
const ENDPOINT = "http://localhost:6000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

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
        const pvkStr = localStorage.getItem("pvk");
        const pvkParse = JSON.parse(pvkStr);
        const pvk = Buffer.from(pvkParse.data);
        const ecdh = createECDH("secp256k1");
        ecdh.setPrivateKey(pvk);
        const publicKeyOfOtherUserParsed = JSON.parse(publicKeyOfOtherUserStr);
        const publicKeyOfOtherUser = Buffer.from(publicKeyOfOtherUserParsed.data);
        const passphraseOfOtherUser = ecdh.computeSecret(publicKeyOfOtherUser).toString("hex");
        data.forEach(message => {
          message.content = AES.decrypt(message.content, passphraseOfOtherUser).toString(
            CryptoJS.enc.Utf8
          );
        });
      }
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
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
          const pvkStr = localStorage.getItem("pvk");
          const pvkParse = JSON.parse(pvkStr);
          const pvk = Buffer.from(pvkParse.data);
          const ecdh = createECDH("secp256k1");
          ecdh.setPrivateKey(pvk);
          const publicKeyOfOtherUserParsed = JSON.parse(publicKeyOfOtherUserStr);
          const publicKeyOfOtherUser = Buffer.from(publicKeyOfOtherUserParsed.data);
          const passphraseOfOtherUser = ecdh.computeSecret(publicKeyOfOtherUser).toString("hex");
          if (!ecdh) return console.log("ECDH is null");
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
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
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
              <Input
                variant="filled"
                bg="#eef2f7"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
                focusBorderColor='#fc839f'
              />
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
