import React from "react";
import {
  ChakraProvider,
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Signup from "../components/authentication/Signup";
import Login from "../components/authentication/Login";

const Homepage = () => {
  const history = useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) history.push("/");
  }, [history]);
  return (
    <Container 
      maxW="xl" 
      centerContent
      position='absolute'
      left='50%'
      top='40%'
      transform='translate(-50%, -40%)'
    >
      <Box
        d="flex"
        justifyContent="center"
        alignItems="center"
        p={3}
        bg="white"
        w="100%"
        m="15px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text textAlign='center' fontSize = "4xl" fontWeight='800'>
          SwiftTalk
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="enclosed" colorScheme="swift">
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;