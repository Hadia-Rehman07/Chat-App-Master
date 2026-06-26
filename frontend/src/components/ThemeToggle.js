import { IconButton, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      onClick={toggleColorMode}
      variant="ghost"
      aria-label="Toggle theme"
      size="md"
      _hover={{ bg: "whiteAlpha.200" }}
      _active={{ bg: "whiteAlpha.300" }}
    />
  );
};

export default ThemeToggle;