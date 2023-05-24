import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { useColorMode } from "@chakra-ui/react";

const UserListItem = (props) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = props.user
  const handleFunction = props.handleFunction
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg={colorMode=== "dark" ? "#272d37" : "#eef2f7"}
      color={colorMode=== "dark" ? "white" : "black"}
      _hover={
        colorMode === "dark" ? {background: "#5cb583", transition: '0.3s',
        boxShadow: "inner"} : {background: "#fc839f", color: "white",transition: '0.3s',
        boxShadow: "inner"}}
      w="100%"
      d="flex"
      alignItems="center"
      px={3}
      py={2}
      mb={1}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        mb={1}
        size="sm"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
