import { Avatar } from "@chakra-ui/avatar";
import axios from "axios";
import { Input } from "@chakra-ui/input";
import { useEffect, useState } from "react";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import CryptoJS from "crypto-js";
import { EditIcon, DeleteIcon, AtSignIcon, CopyIcon, DownloadIcon, CheckIcon } from "@chakra-ui/icons";
import {
  getPassphraseOfOtherUser,
  getSenderFull,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Button,
  useToast
} from "@chakra-ui/react";


const ScrollableChat = ({ messages, setNeedChatUpdate }) => {
  const [editingMessageId, setEditingMessageId] = useState("");
  const [editingMessageContent, setEditingMessageContent] = useState("");
  const { user } = ChatState();
  const toast = useToast();


  async function handleEditSave(m) {
    console.log('Edit button clicked');
    console.log(`Message Id: ${m._id}`);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      console.log(m._id);
      console.log(m.chat.isGroupChat);
      if (m.chat.isGroupChat) {
        await axios.put(
          `/api/message/`,
          {
            _id: m._id,
            sender: m.sender,
            content: editingMessageContent,
            chat: m.chat,
            attachments: m.attachments
          },
          config
        );
      }
      else {
        console.log(m.chat.users);
        const { AES } = CryptoJS;
        const publicKeyOfOtherUserStr = getSenderFull(user, m.chat.users).publicKey;
        const passphraseOfOtherUser = getPassphraseOfOtherUser(publicKeyOfOtherUserStr);
        const editedMessage = AES.encrypt(editingMessageContent, passphraseOfOtherUser).toString();
        await axios.put(
          `/api/message/`,
          {
            _id: m._id,
            sender: m.sender,
            content: editedMessage,
            chat: m.chat,
            attachments: m.attachments
          },
          config
        );
      }
      setNeedChatUpdate(true);
      setEditingMessageContent("");
      setEditingMessageId("");

      toast({
        title: "Message edited",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to edit the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  async function handleDownloadClick(m) {
    console.log('Edit button clicked');
    console.log(`Message Id: ${m._id}`);
    const link = document.createElement('a');
    link.href = m.attachments.url;
    link.download = true;
    link.click();
  }

  async function handleDeleteClick(m) {
    console.log('Delete button clicked');
    console.log(`Message Id: ${m._id}`);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.delete(
        `/api/message/${m._id}`,
        config
      );
      setNeedChatUpdate(true);
      toast({
        title: "Message deleted",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to delete the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  async function handleCopyClick(m) {
    console.log('Copy button clicked');
    console.log(`Message Id: ${m._id}`);

    try {
      await navigator.clipboard.writeText(m.content);
      toast({
        title: "Message has been copied",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.log('Message content copied to clipboard');
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to copy content of message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.error('Failed to copy message content:', error);
    }
  }

  const handleRightClick = (event) => {
    console.log('Right mouse button clicked');
    event.preventDefault();

  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <Menu
              placement="left-start"
            >
              <MenuButton
                onContextMenu={handleRightClick}
                style={{
                  backgroundColor: `${m.sender._id === user._id ? "#F35E80" : "#F8D4DF"
                    }`,
                   marginLeft: isSameSenderMargin(messages, m, i, user._id),
                    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                    color: `${ m.sender._id === user._id ? "white" : "black" }`,
                }}
              >
                {editingMessageId === m._id ? (
                  <Input
                    autoFocus
                    variant="filled"
                    bg="#BEE3F8"
                    placeholder={m.content}
                    value={editingMessageContent}
                    onChange={(e) => setEditingMessageContent(e.target.value)}
                    flex="1"
                  />

                ) : (
                  m.attachments ? (
                    m.attachments.filename === "png" ||
                      m.attachments.filename === "jpg" ? (
                      <img
                        src={m.attachments.url}
                        alt="Picture"
                        style={{ maxWidth: "100%" }}
                      />
                    ) : (
                      <a href={m.attachments.url} download>
                        Click to download file
                      </a>
                    )
                  ) : (
                    m.content
                  )
                )}
              </MenuButton>
              <MenuList>

                {editingMessageId === m._id && m.sender._id === user._id ? (
                  <MenuItem
                    fontWeight={500}
                    icon={<CheckIcon boxSize={4} />}
                    onClick={() => handleEditSave(m)}
                  >
                    Save
                  </MenuItem>
                ) : (
                  !m.attachments && m.sender._id === user._id && (
                    <MenuItem
                      fontWeight={500}
                      icon={<EditIcon boxSize={4} />}
                      onClick={() => setEditingMessageId(m._id)}
                    >
                      Edit
                    </MenuItem>
                  )
                )}
                {m.attachments ? (
                  <MenuItem
                    fontWeight={500}
                    icon={<DownloadIcon boxSize={4} />}
                    onClick={() => handleDownloadClick(m)}
                  >
                    Download
                  </MenuItem>
                ) : (
                  <MenuItem
                    fontWeight={500}
                    icon={<CopyIcon boxSize={4} />}
                    onClick={() => handleCopyClick(m)}
                  >
                    Copy
                  </MenuItem>
                )}
                {m.sender._id === user._id ? (
                  <MenuItem
                    fontWeight={500}
                    icon={<DeleteIcon boxSize={4} />}
                    onClick={() => handleDeleteClick(m)}
                  >
                    Delete
                  </MenuItem>
                ) : (
                  null
                )}

              </MenuList>
            </Menu>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
