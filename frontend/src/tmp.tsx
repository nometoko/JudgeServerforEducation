import { useEffect, useState } from "react";
import { Box, Button, Heading, Text } from "@chakra-ui/react";

////const API_BASE_URL = `http://${process.env.PUBLIC_SERVER_IP}:${process.env.BACKEND_PORT}`;
//const API_BASE_URL = 'http://localhost:8000';

const API_BASE_URL = `http://${process.env.REACT_APP_PUBLIC_SERVER_IP}:${process.env.REACT_APP_BACKEND_PORT}`;

console.log("API_BASE_URL:", API_BASE_URL);
console.log("API_BASE_URL:", API_BASE_URL);

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch(`${API_BASE_URL}/`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Error fetching data"));
  }, []);

  return (
    <Box p={4} textAlign="center">
      <Heading mb={4}>FastAPI + React App</Heading>
      <Text fontSize="xl" mb={4}>{message}</Text>
      <Button colorScheme="blue" onClick={() => window.location.reload()}>
        Reload
      </Button>
    </Box>
  );
}

export default App;