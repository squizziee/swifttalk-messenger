import React from "react";
import { ViewIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { EditIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/toast";
import { useColorMode } from "@chakra-ui/react";
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
    const hiddenFileRef = React.useRef(null);
    const handleUpload = event => {
        hiddenFileRef.current.click();
    }
    const { colorMode } = useColorMode();
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
                <ModalContent>
                    <ModalHeader>
                        <Flex display='flex' direction="column" alignItems="center" mb='15px'>
                            <Flex display='flex' direction="row" justifyContent="center">
                                <InputGroup width="70%">
                                    <Input id="name"
                                        spellCheck='false'
                                        variant="unstyled"
                                        fontSize="3xl"
                                        fontWeight="500"
                                        value={newName}
                                        textAlign="center"
                                        isDisabled={isDisableName}
                                        onChange={(e) => setNewName(e.target.value)}
                                    />
                                    <InputRightElement>
                                        <IconButton
                                            mb={-0.5}
                                            size='sm'
                                            color={isDisableName ? 'gray' : 'black'}
                                            variant='ghost'
                                            icon={<EditIcon />}
                                            onClick={() => isDisableName ? setDisableName(false) : setDisableName(true)}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                            </Flex>
                            <Flex display='flex' direction="row" justifyContent="center" width="100%" mt="5px">
                                <InputGroup>
                                    <Input
                                        spellCheck='false'
                                        variant="unstyled"
                                        fontSize="xl"
                                        fontWeight="400"
                                        textAlign="center"
                                        isDisabled={isDisableBio}
                                        value={newBio}
                                        onChange={(e) => setNewBio(e.target.value)}
                                    />
                                    <InputRightElement>
                                        <IconButton
                                            mb={2.5}
                                            color={isDisableBio ? 'gray' : 'black'}
                                            variant='ghost'
                                            size='sm'
                                            icon={<EditIcon />}
                                            onClick={() => isDisableBio ? setDisableBio(false) : setDisableBio(true)}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                            </Flex>
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                    >
                        <FormLabel display="flex"
                            justifyContent="center"
                            fontSize="xl"
                            fontWeight="normal"
                        >Upload your Picture</FormLabel>
                        <FormControl id="pic">
                            <Button size="md" onClick={handleUpload} width="100%" marginTop="10px">
                                Choose a photo
                            </Button>
                            <Input
                                ref={hiddenFileRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => postDetails(e.target.files[0])}
                                style={{ display: 'none' }}
                            />
                        </FormControl>
                        <Button
  backgroundColor={colorMode === "dark" ? "#5cb583" : "#fc839f"}
  color="white"
  width="100%"
  marginTop="15px"
  marginBottom="25px"
  onClick={submitHandler}
  isLoading={picLoading}
>
                            Update
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default EditModal;