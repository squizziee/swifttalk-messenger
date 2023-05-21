import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";

const UserListItem = (props) => {
  // const { user } = ChatState();
  const user = props.user
  const handleFunction = props.handleFunction
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#eef2f7"
      _hover={{
        background: "#fc839f",
        color: "white",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={1}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        mb={1}
        size="sm"
        cursor="pointer"
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
