import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const Logo = ({ fontSize = "4xl" }) => {
  const textColor = useColorModeValue("blue.600", "blue.300");

  return (
    <Box d="flex" alignItems="center">
      <MotionBox
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        mr={2}
      >
        <svg
          width="1.2em"
          height="1.2em"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 10H16M8 14H13M21 12C21 16.9706 16.9706 21 12 21C10.6698 21 9.40683 20.7121 8.28318 20.2013L3.10931 21.0635C2.55747 21.1554 2.11585 20.66 2.25732 20.1172L3.58554 15.021C2.5833 13.626 2 11.8841 2 10C2 5.02944 6.47715 1 12 1C17.5228 1 21 5.02944 21 12Z"
            stroke={useColorModeValue("#3182ce", "#63b3ed")}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </MotionBox>
      <Text fontSize={fontSize} fontFamily="Work sans" fontWeight="bold" color={textColor}>
        Talk-A-Tive
      </Text>
    </Box>
  );
};

export default Logo;
