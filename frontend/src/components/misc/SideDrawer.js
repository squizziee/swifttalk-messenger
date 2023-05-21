import React from "react";
import { useState } from "react";
import { Box, Text } from "@chakra-ui/layout";
import { Button, Input, Spinner } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { ChatState } from "../../context/ChatProvider";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import EditModal from "./EditProfile";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [loadingPic, setLoadingPic] = useState(false);

  const {
    setSelectedChat,
    user,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const toast = useToast();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
    window.location.reload();
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setLoadingPic(user.pic);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        m="10px 10px 0px 10px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        //width="99%"
        p="5px 10px 5px 10px"
        borderWidth="1px"
        borderRadius="lg"
      >
        <Button variant="ghost" onClick={onOpen}>
          <i className="fas fa-search"></i>
          <Text display={{ base: "none", md: "flex" }} px="4">
            Search
          </Text>
        </Button>
        <Text fontSize="2xl" fontWeight="bold">
          SwiftTalk Alpha
        </Text>
        <div>
          <Menu>
            <MenuButton p={2}>
              <Button>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <i className="fas fa-bell"></i>
              </Button>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              //rightIcon={<i className="fas fa-search"></i>}
            >
              <Avatar
                size="xs"
                cursor="pointer"
                name={user.name}
                src={loadingPic ? loadingPic : setLoadingPic(user.pic)}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal
                user={user}
                loadingPic={loadingPic}
                setLoadingPic={setLoadingPic}
              >
                <MenuItem>Profile</MenuItem>
              </ProfileModal>
              <EditModal user={user} setLoadingPic={setLoadingPic}>
                <MenuItem>Edit Profile</MenuItem>
              </EditModal>
              <MenuItem onClick={logoutHandler} color="red">Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
