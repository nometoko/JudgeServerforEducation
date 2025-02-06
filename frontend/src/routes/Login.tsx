import { useState } from "react";
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Flex,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react";

interface LoginProps {
    message: string;
  }

const Login = ({message}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        if (username === "user" && password === "password") {
            alert("ログイン成功！🎉");
        } else {
            //setError("ユーザー名またはパスワードが違います。");
            setError(message);
        }
    };

    return (
        <Flex w="100vw" h="100vh" align="center" justify="center">
            <Container maxW="lg" py="12" px="6" bg="white" boxShadow="md" borderRadius="md">
                <Box
                    p="8"
                    borderWidth="1px"
                    borderRadius="lg"
                    boxShadow="lg"
                    bg="white"
                >
                    <VStack spacing="6">
                        <Heading size="lg" textAlign="center">
                            ログイン
                        </Heading>

                        <FormControl>
                            <FormLabel>UserName</FormLabel>
                            <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>

                        {error && <Text color="red.500">{error}</Text>}

                        <Button
                            bg="#81E6D9"
                            width="full"
                            shadow="md"
                            onClick={handleLogin}
                            _hover={{ bg: "#38B2AC" }}
                        >
                            ログイン
                        </Button>
                    </VStack>
                </Box>
            </Container >
        </Flex>
    );
};

export default Login;
