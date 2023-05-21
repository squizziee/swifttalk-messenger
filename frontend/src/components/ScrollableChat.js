import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { EditIcon, DeleteIcon, AtSignIcon, CopyIcon } from "@chakra-ui/icons";
import {
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
} from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
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
            <Menu placement="left-start">
              <MenuButton
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  alignItems: "center",
                }}
              >
                {m.attachments ? (
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
                )}
              </MenuButton>
              <MenuList>
                <MenuItem fontWeight={500} icon={<EditIcon boxSize={4} />}>
                  Edit
                </MenuItem>
                <MenuItem fontWeight={500} icon={<DeleteIcon boxSize={4} />}>
                  Delete
                </MenuItem>
                <MenuItem fontWeight={500} icon={<CopyIcon boxSize={4} />}>
                  Copy
                </MenuItem>
                <MenuItem fontWeight={500} icon={<AtSignIcon boxSize={4} />}>
                  Forward
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
