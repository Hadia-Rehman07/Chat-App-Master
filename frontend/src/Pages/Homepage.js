import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import { motion } from "framer-motion";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle"; // Import ThemeToggle

const MotionBox = motion(Box);

function Homepage() {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);

  const boxBg = useColorModeValue("white", "gray.800");

  const bubbleVariants = {
    animate: {
      y: [0, -1000],
      opacity: [0, 1, 0],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const bubbles = Array.from({ length: 15 }).map((_, i) => ({
    size: Math.random() * 40 + 20,
    left: `${Math.random() * 100}%`,
    animationDuration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <Box
      w="100%"
      minH="100vh"
      bgGradient={useColorModeValue(
        "linear(to-br, blue.400, blue.600)",
        "linear(to-br, gray.800, blue.900)"
      )}
      position="relative"
      overflow="hidden"
      display="flex"
      alignItems="center"
    >
      {bubbles.map((bubble, i) => (
        <MotionBox
          key={i}
          position="absolute"
          bottom="-100px"
          left={bubble.left}
          w={`${bubble.size}px`}
          h={`${bubble.size}px`}
          bg="whiteAlpha.300"
          borderRadius="full"
          variants={bubbleVariants}
          animate="animate"
          transition={{
            duration: bubble.animationDuration,
            repeat: Infinity,
            delay: bubble.delay,
            ease: "linear",
          }}
        />
      ))}

      <Container maxW="xl" centerContent position="relative" zIndex={1}>
        <Box
          display="flex"
          justifyContent="space-between" // Logo aur Toggle ko align karne ke liye
          alignItems="center"
          p={3}
          bg={boxBg}
          w="100%"
          m="40px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
          boxShadow="xl"
        >
          {/* Logo container ke left side par thoda padding taake balance rahe */}
          <Box flex="1" textAlign="center" pl="40px">
            <Logo fontSize="4xl" />
          </Box>

          {/* ThemeToggle ab yahan Logo ke right side par ayega */}
          <ThemeToggle />
        </Box>

        <Box bg={boxBg} w="100%" p={4} borderRadius="lg" borderWidth="1px" boxShadow="xl">
          <Tabs isFitted variant="soft-rounded" colorScheme="blue">
            <TabList mb="1em">
              <Tab>Login</Tab>
              <Tab>Sign Up</Tab>
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
    </Box>
  );
}

export default Homepage;