import React from "react";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorMode,
  Button,
  ChakraProvider,
  extendTheme,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import Signup from "../components/authentication/Signup";
import Login from "../components/authentication/Login";
import { Image } from "@chakra-ui/react";
import logo from "../coloring/logo.png";
import background from "../coloring/background-light.png";
import darkBackground from "../coloring/background-dark.png";

const Homepage = () => {
  const history = useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) history.push("/");
  }, [history]);

  const { colorMode, toggleColorMode } = useColorMode();
  const backgroundImage = (colorMode === "dark" ? darkBackground : background);

  return (
      <Box
        w="100vw"
        h="100vh"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
        }}
      >
        <Container
          maxW="xl"
          centerContent
          position="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
        >
          <Box
            d="flex"
            justifyContent="center"
            alignItems="center"
            p={3}
            bg={colorMode === "dark" ? "gray.700" : "white"}
            w="100%"
            mb='15px'
            borderRadius="lg"
            boxShadow={colorMode === "dark" ? "xl" : "base"}
          >
            <Image
              src={logo}
              left="50%"
              top="50%"
              transform="translate(83%, 0)"
              boxSize="35%"
              alt="logo"
              my='5px'
            />
          </Box>
          <Box 
              bg={colorMode === "dark" ? "gray.700" : "white"}
              w="100%"
              p={4}
              borderRadius="lg"
              boxShadow={colorMode === "dark" ? "xl" : "base"}
          >
            <Tabs 
                isFitted
                variant="enclosed"
                colorScheme="swift"
            >
              <TabList mb="1em">
                <Tab
                  width="50%"
                >
                  Login
                </Tab>
                <Tab
                  width="50%"
                >
                  Sign up
                </Tab>
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
        <Button
          onClick={toggleColorMode}
          position="fixed"
          top="1rem"
          right="1rem"
          size='sm'
          bg={colorMode === "dark" ? "white" : "gray.700"}
          color={colorMode === "dark" ? "gray.700" : "white"}
          _hover={{
            bg: colorMode === "dark" ? "gray.200" : "gray.800",
          }}
          _active={{
            bg: colorMode === "dark" ? "gray.300" : "gray.700",
          }}
        >
          {colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
        </Button>
      </Box>
  );
};

export default Homepage;
