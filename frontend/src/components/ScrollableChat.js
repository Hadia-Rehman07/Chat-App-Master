import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { useColorModeValue, Box, Text } from "@chakra-ui/react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  // Dark/Light mode color theme variables
  const dateBg = useColorModeValue("gray.200", "gray.700");
  const dateTextColor = useColorModeValue("gray.600", "gray.300");

  const myMsgBg = "#BEE3F8"; // Light Blue for Logged-in User
  const theirMsgBg = "#B9F5D0"; // Light Green for Other Users

  // Helper function to format Date & Day Labels
  const formatMessageDate = (dateStr) => {
    const messageDate = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          // --- 1. Date Header Separation Logic ---
          const isFirstMessageOfDay =
            i === 0 ||
            new Date(messages[i].createdAt).toDateString() !==
            new Date(messages[i - 1].createdAt).toDateString();

          // Safe string ID checking strictly for type conversion
          const currentSenderId = m.sender && typeof m.sender === "object" ? m.sender._id : m.sender;
          const isMyMessage = String(currentSenderId) === String(user?._id);

          return (
            <Box key={m._id || i} display="flex" flexDirection="column" w="100%">
              {/* --- Central Static Date Label Display --- */}
              {isFirstMessageOfDay && (
                <Box display="flex" justifyContent="center" my={2}>
                  <Text
                    fontSize="11px"
                    fontWeight="bold"
                    bg={dateBg}
                    color={dateTextColor}
                    px={3}
                    py={1}
                    borderRadius="full"
                    boxShadow="sm"
                  >
                    {formatMessageDate(m.createdAt || new Date())}
                  </Text>
                </Box>
              )}

              {/* --- 2. Message Row Layout Stability --- */}
              <div style={{ display: "flex", width: "100%" }} key={m._id || i}>
                {(isSameSender(messages, m, i, user._id) ||
                  isLastMessage(messages, i, user._id)) && (
                    <Tooltip label={m.sender?.name} placement="bottom-start" hasArrow>
                      <Avatar
                        mt="7px"
                        mr={1}
                        size="sm"
                        cursor="pointer"
                        name={m.sender?.name}
                        src={m.sender?.pic}
                      />
                    </Tooltip>
                  )}

                {/* --- 3. Stable Structure and Bubble Alignment (Restored fully to your exact specs) --- */}
                <span
                  style={{
                    backgroundColor: `${isMyMessage ? myMsgBg : theirMsgBg}`,
                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                    borderRadius: isMyMessage
                      ? "15px 15px 0 15px" // Right curve
                      : "15px 15px 15px 0", // Left curve
                    padding: "6px 12px",
                    maxWidth: "75%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* --- Clean Message Text Content Display --- */}
                  <Text fontSize="15px">{m.content}</Text>

                  {/* --- Real-Time Content Time --- */}
                  <Text fontSize="9px" opacity={0.65} textAlign="right" mt={1}>
                    {new Date(m.createdAt || new Date()).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </Text>
                </span>
              </div>
            </Box>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;