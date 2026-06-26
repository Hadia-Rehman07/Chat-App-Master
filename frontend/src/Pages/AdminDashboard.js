import { Box, Text, VStack, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import { useHistory } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = ChatState();
  const history = useHistory();
  const [stats, setStats] = useState({ users: 0, chats: 0 });
  const [loading, setLoading] = useState(true);

  const bg = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("black", "white");

  useEffect(() => {
    if (!user || user.isAdmin !== true) {
      history.push("/");
      return;
    }

    const fetchStats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        // Fetch users (empty search returns all)
        const { data: usersData } = await axios.get("/api/user?search=", config);
        // Fetch chats
        const { data: chatsData } = await axios.get("/api/chat", config);
        
        setStats({
          users: usersData.length + 1, // +1 for the admin themselves
          chats: chatsData.length,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, history]);

  if (!user || user.isAdmin !== true) return null;

  return (
    <Box w="100%" h="100vh" bg={bg} color={textColor} p={10}>
      <Text fontSize="4xl" fontFamily="Work sans" mb={8} fontWeight="bold">
        Admin Dashboard
      </Text>
      
      {loading ? (
        <Text>Loading statistics...</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          <Box bg={cardBg} p={8} borderRadius="lg" shadow="md" textAlign="center">
            <Text fontSize="2xl" mb={2} color="gray.500">Total Registered Users</Text>
            <Text fontSize="6xl" fontWeight="bold">{stats.users}</Text>
          </Box>
          <Box bg={cardBg} p={8} borderRadius="lg" shadow="md" textAlign="center">
            <Text fontSize="2xl" mb={2} color="gray.500">Total Active Chats</Text>
            <Text fontSize="6xl" fontWeight="bold">{stats.chats}</Text>
          </Box>
        </SimpleGrid>
      )}
    </Box>
  );
};

export default AdminDashboard;
