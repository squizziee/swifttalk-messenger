import { ViewIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { EditIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/toast";

import axios from "axios";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    IconButton,
    Flex
} from "@chakra-ui/react";

import { useState } from "react";
import { useHistory } from "react-router";

const EditModal = ({ user, children, setLoadingPic }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const [pic, setPic] = useState();
    const [isDisableName, setDisableName] = useState(true);
    const [isDisableBio, setDisableBio] = useState(true);
    const [picLoading, setPicLoading] = useState(false);
    const [newName, setNewName] = useState(user.name);
    const [newBio, setNewBio] = useState(user.bio);
    const submitHandler = async () => {
        console.log("uploading", pic)
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post(
                "/api/user/edit",
                {
                    user: user,
                    pic: pic,
                    name: newName,
                    bio: newBio,
                },
                config
            );
            setLoadingPic(pic);
            console.log(data);
            toast({
                title: "Updated User",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            var loc = localStorage.getItem('userInfo');
            const existing = JSON.parse(loc);
            console.log("l", existing);
            existing.pic = pic;
            existing.name = newName;
            existing.bio = newBio;
            console.log(existing);
            localStorage.setItem("userInfo", JSON.stringify(existing));
            setPicLoading(false);

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false);
        }
    };

    const postDetails = (pics) => {
        setPicLoading(true);
        console.log("in details")
        if (pics === undefined) {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        console.log(pics);
        if (pics.type === "image/jpeg" || pics.type === "image/png") {

            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "piyushproj");
            fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    console.log(data.url.toString());
                    setPicLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setPicLoading(false);
                });
        } else {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false);
            return;
        }
    };


    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
            )}
            <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent h="410px">
                    <ModalHeader>
                        <Flex direction="column" alignItems="center">
                            <Flex direction="row" alignItems="center">
                                <Input
                                    variant="filled"
                                    size="md"
                                    fontSize="25px"
                                    fontWeight="500"
                                    bg="#FFFFFF"
                                    value={newName}
                                    p={1.5}
                                    textAlign="center"
                                    mb={4}
                                    isDisabled={isDisableName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                                <IconButton
                                    color='gray'
                                    variant='ghost'
                                    icon={<EditIcon />}
                                    ml={2}
                                    mb={4}
                                    onClick={() => isDisableName ? setDisableName(false) : setDisableName(true)}
                                />
                            </Flex>
                            <Flex direction="row" alignItems="center">
                                <Input
                                    variant="filled"
                                    size="lg"
                                    fontSize="17px"
                                    fontWeight="500"

                                    bg="#FFFFFF"
                                    p={1.5}
                                    textAlign="center"
                                    isDisabled={isDisableBio}
                                    value={newBio}
                                    onChange={(e) => setNewBio(e.target.value)}
                                />
                                <IconButton
                                    color='gray'
                                    variant='ghost'
                                    icon={<EditIcon />}
                                    ml={2}
                                    onClick={() => isDisableBio ? setDisableBio(false) : setDisableBio(true)}
                                />
                            </Flex>
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <FormControl id="pic">
                            <FormLabel>Upload your Picture</FormLabel>
                            <Input
                                type="file"
                                p={1.5}
                                accept="image/*"
                                onChange={(e) => postDetails(e.target.files[0])}
                            />
                        </FormControl>
                        <Button
                            colorScheme="blue"
                            width="100%"
                            style={{ marginTop: 15 }}
                            onClick={submitHandler}
                            isLoading={picLoading}
                        >
                            Update
                        </Button>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default EditModal;