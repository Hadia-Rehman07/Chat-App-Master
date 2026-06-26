import { ViewIcon, EditIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  Input,
  FormControl,
  FormLabel,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user: loggedInUser, setUser } = ChatState();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [pic, setPic] = useState(user.pic);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const isOwnProfile = loggedInUser && loggedInUser._id === user._id;

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      };
      
      const { data } = await axios.put(
        "/api/user/profile",
        { name, pic },
        config
      );

      toast({
        title: "Profile Updated!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setIsEditing(false);
      setLoading(false);
      // optionally close modal, but leaving it open is fine
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to update profile",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const uploadPic = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === "image/jpeg" || file.type === "image/png") {
      setLoading(true);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "piyushproj");
      fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" onClose={() => { onClose(); setIsEditing(false); }} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {isEditing ? "Edit Profile" : user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            {isEditing ? (
              <VStack spacing={3} w="100%">
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>Profile Picture</FormLabel>
                  <Input type="file" accept="image/*" onChange={uploadPic} p={1.5} />
                </FormControl>
              </VStack>
            ) : (
              <>
                <Image
                  borderRadius="full"
                  boxSize="150px"
                  src={isOwnProfile ? loggedInUser.pic : user.pic}
                  alt={user.name}
                />
                <Text
                  fontSize={{ base: "28px", md: "30px" }}
                  fontFamily="Work sans"
                >
                  Email: {user.email}
                </Text>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            {isEditing ? (
              <Button colorScheme="blue" mr={3} onClick={handleUpdate} isLoading={loading}>
                Save
              </Button>
            ) : (
              isOwnProfile && (
                <Button leftIcon={<EditIcon />} mr={3} onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )
            )}
            <Button onClick={() => { onClose(); setIsEditing(false); }}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
