import React from "react";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorMode,
  Button,
  ChakraProvider,
  extendTheme,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import { MoonIcon, SunIcon } from "@chakra-ui/icons"; // Импорт иконок
import Signup from "../components/authentication/Signup";
import Login from "../components/authentication/Login";
import { Image } from "@chakra-ui/react";
import logo from "../coloring/logo.png";
import background from "../coloring/background-light.png";
import darkBackground from "../coloring/background-dark.png";

const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        _focus: {
          boxShadow: "none",
        },
      },
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "black" : "white",
        color: props.colorMode === "dark" ? "white" : "black",
      },
    }),
  },
});

const Homepage = () => {
  const history = useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) history.push("/");
  }, [history]);

  const { colorMode, toggleColorMode } = useColorMode();
  const backgroundImage = colorMode === "dark" ? darkBackground : background;

  return (
    <ChakraProvider theme={theme}>
      <Box
        w="100vw"
        h="100vh"
        bg="#eef2f7"
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
          top="40%"
          transform="translate(-50%, -40%)"
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
            boxShadow="base"
          >
            <Image
              src={logo}
              left="50%"
              top="50%"
              transform="translate(68%, 0)"
              boxSize="40%"
              alt="logo"
            />
          </Box>
          <Box bg="white" w="100%" p={4} borderRadius="lg" boxShadow="base">
            <Tabs isFitted variant="enclosed" colorScheme="swift">
              <TabList mb="1em">
                <Tab
                  width="50%"
                  colorScheme={colorMode === "dark" ? "white" : "pink"}
                >
                  Login
                </Tab>
                <Tab
                  width="50%"
                  colorScheme={colorMode === "dark" ? "white" : "pink"}
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
          bg={colorMode === "dark" ? "white" : "black"}
          color={colorMode === "dark" ? "black" : "white"}
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
    </ChakraProvider>
  );
};

export default Homepage;
