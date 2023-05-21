import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";

const ProfileModal = ({ user, children, loadingPic, setLoadingPic }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <Button
          display={{ base: "flex" }}
          // icon={<i className="fas fa-eye"></i>}
          onClick={onOpen}
        >
          <ViewIcon/>
        </Button>
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="4xl"
            display="flex"
            justifyContent="center"
            fontWeight="medium"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              display="flex"
              justifyContent="center"
              borderRadius="full"
              boxSize="150px"
              src={loadingPic ? loadingPic : user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "2xl", md: "xl" }}
              m="15px 0px 30px 0px"
            >
              <b>Email:</b> {user.email}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
