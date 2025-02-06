import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Flex,
    VStack,
    Text,
    Image,
} from "@chakra-ui/react";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // 🔹 パスワード入力欄の参照を作成
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleLogin = () => {
        if (username === "a" && password === "a") {
            navigate(`/dashboard`, { replace: true });
        } else {
            setError("We don't recognize this user ID or password");
        }
    };

    /** 🔹 Enterキーを押したらパスワード入力欄にフォーカス */
    const handleKeyDownUserName = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            passwordRef.current?.focus(); // パスワード入力欄にフォーカスを移動
        }
    };

    /** 🔹 Enterキーを押したらログインボタンを押す */
    const handleKeyDownPassword = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <Flex h="100vh" align="center" justify="center">
            {/* 左上のロゴとテキスト */}
            <Box position="absolute" top="10px" left="10px">
                <Image src="../../img/funalab.png" alt="funalab logo" boxSize="100px" />
            </Box>

            {/* ログインフォーム */}
            <Container maxW="xl" py={{ base: "10", lg: "12" }} px={{ base: "0", lg: "10" }} bg="white" boxShadow="md" borderRadius="md">
                <Box p="20" borderWidth="1px" borderRadius="lg" boxShadow="md" bg="white">
                    <VStack spacing="6">
                        <Heading size="lg" textAlign="center">
                            Login
                        </Heading>

                        <FormControl>
                            <FormLabel>UserName</FormLabel>
                            <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyDown={handleKeyDownUserName} // ⬅ Enter でパスワード欄にフォーカス
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleKeyDownPassword} // ⬅ Enter でログイン
                                ref={passwordRef} // ⬅ パスワード欄の参照をセット
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
            </Container>
        </Flex>
    );
};

export default Login;
