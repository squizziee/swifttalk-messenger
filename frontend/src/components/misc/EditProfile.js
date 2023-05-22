import { ViewIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";

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
} from "@chakra-ui/react";

import { useState } from "react";
import { useHistory } from "react-router";

const EditModal = ({ user, children, setLoadingPic }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const [pic, setPic] = useState();
    const [picLoading, setPicLoading] = useState(false);

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
                    user,
                    pic,
                },
                config
            );
            setLoadingPic(pic);
            console.log(data);
            toast({
                title: "Updated Image",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            var loc = localStorage.getItem('userInfo');
            const existing = JSON.parse(loc)
            console.log("l", existing)
            existing.pic = pic
            console.log(existing)
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
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                            <h1 style={{ fontSize:"40px"}}>{user.name}</h1>
                            <IconButton color='gray' variant='ghost' icon={<i class="fa-solid fa-pen"></i>} ml={2} /*onClick={}*/ />
                        </div>
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                                <h2 style={{ fontSize:"17px", fontWeight:"500"}}>'user.tag'</h2>
                                <IconButton color='gray' variant='ghost' icon={<i class="fa-solid fa-pen"></i>} ml={2} size="xs" /*onClick={}*/ />
                        </div>
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
                            Upload
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