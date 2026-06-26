import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, useToast, useColorModeValue, Spinner } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ArrowBackIcon, AttachmentIcon, LockIcon } from "@chakra-ui/icons";
import { IoSend } from "react-icons/io5";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import ChatLoading from "./ChatLoading";
import EmojiPicker from "emoji-picker-react";

import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";

const ENDPOINT = "http://localhost:5000";
var socket;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);

  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();
  const toast = useToast();

  const bgMain = useColorModeValue("#E8E8E8", "gray.900");
  const encryptionBg = useColorModeValue("yellow.100", "yellow.900");
  const encryptionColor = useColorModeValue("yellow.700", "yellow.200");
  const inputBg = useColorModeValue("#E0E0E0", "gray.700");

  // Ref container to always maintain current active chat reference across socket closures
  const selectedChatRef = useRef(selectedChat);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  const postDetails = (file) => {
    setFileLoading(true);
    if (!file) {
      toast({ title: "Please Select a File!", status: "warning", duration: 5000, isClosable: true, position: "bottom" });
      setFileLoading(false);
      return;
    }

    if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "application/pdf") {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dvipfopxm");

      fetch("https://api.cloudinary.com/v1_1/dvipfopxm/auto/upload", { method: "post", body: data })
        .then((res) => res.json())
        .then((data) => {
          setNewMessage(data.url.toString());
          setFileLoading(false);
          toast({ title: "File Uploaded Successfully!", description: "Now click the send button.", status: "success", duration: 3000, isClosable: true });
        })
        .catch((err) => {
          console.error(err);
          setFileLoading(false);
          toast({ title: "Upload Failed", status: "error", duration: 5000 });
        });
    } else {
      toast({ title: "Invalid File!", description: "Please select an Image or PDF.", status: "warning", duration: 5000, isClosable: true });
      setFileLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({ title: "Error!", description: "Failed to Load Messages", status: "error" });
    }
  };

  const sendMessage = async (event) => {
    if (event && event.key !== "Enter") return;

    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const messageToSend = newMessage;
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          { content: messageToSend, chatId: selectedChat._id },
          config
        );
        socket.emit("new message", data);
        setMessages((prev) => [...prev, data]);
        setFetchAgain(!fetchAgain);
      } catch (error) {
        toast({ title: "Error!", description: "Failed to send message", status: "error" });
      }
    }
  };

  // Socket Initial Setup
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // Fetch Messages on Chat Change
  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  // FIXED REAL-TIME NOTIFICATION EVENT CAPTURE LOGIC
  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (newMessageRecieved) => {
      const currentChat = selectedChatRef.current;

      if (!currentChat || currentChat._id !== newMessageRecieved.chat._id) {
        // Strict notification trigger array distribution
        setNotification((prevNotifications) => {
          if (!prevNotifications.some((n) => String(n._id) === String(newMessageRecieved._id))) {
            return [newMessageRecieved, ...prevNotifications];
          }
          return prevNotifications;
        });
        setFetchAgain((prev) => !prev);
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
        setFetchAgain((prev) => !prev);
      }
    };

    socket.on("message recieved", handleMessageReceived);

    return () => {
      socket.off("message recieved", handleMessageReceived);
    };
  }, []); // Bound to mount to ensure robust event synchronization

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3} px={2} w="100%" fontFamily="Work sans"
            display="flex" justifyContent={{ base: "space-between" }} alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>
          <Box
            display="flex" flexDir="column" justifyContent="flex-end"
            p={3} bg={bgMain} w="100%" h="100%" borderRadius="lg" overflowY="hidden"
          >
            {loading ? (
              <ChatLoading />
            ) : (
              <div className="messages" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
                <Box display="flex" justifyContent="center" mb={3} mt={1}>
                  <Text fontSize="11px" color={encryptionColor} bg={encryptionBg} p={2} borderRadius="md" textAlign="center">
                    <LockIcon mr={1} mb="2px" /> Messages are end-to-end encrypted.
                  </Text>
                </Box>
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} id="message-input" isRequired mt={3}>
              {istyping && (
                <Lottie options={defaultOptions} width={70} style={{ marginBottom: 15, marginLeft: 0 }} />
              )}
              {showEmoji && (
                <Box position="absolute" bottom="70px" zIndex={100}>
                  <EmojiPicker onEmojiClick={(emojiData) => setNewMessage(newMessage + emojiData.emoji)} />
                </Box>
              )}

              <Box display="flex" alignItems="center" gap={2}>
                <IconButton
                  icon={<span style={{ fontSize: '20px' }}>😊</span>}
                  onClick={() => setShowEmoji(!showEmoji)}
                  variant="ghost"
                />

                <Box position="relative">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => postDetails(e.target.files[0])}
                    style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }}
                  />
                  <IconButton
                    icon={fileLoading ? <Spinner size="sm" /> : <AttachmentIcon />}
                    variant="ghost"
                  />
                </Box>

                <Input
                  variant="filled"
                  bg={inputBg}
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={typingHandler}
                  borderRadius="full"
                />

                <IconButton
                  colorScheme="teal"
                  icon={<IoSend />}
                  isRound={true}
                  onClick={() => sendMessage()}
                  disabled={!newMessage || fileLoading}
                  _hover={{ transform: "scale(1.1)", bg: "teal.600" }}
                  transition="all 0.2s"
                />
              </Box>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">Click on a user to start chatting</Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;