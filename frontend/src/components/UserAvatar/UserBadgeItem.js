import { Badge } from "@chakra-ui/layout";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      px={2}
      py={1}
      mb={3}
      mr={1}
      variant="solid"
      fontSize={12}
      colorScheme="cyan"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      {admin === user._id && <span> (Admin)</span>}
      <i class="fa-solid fa-xmark"></i>
    </Badge>
  );
};

export default UserBadgeItem;
