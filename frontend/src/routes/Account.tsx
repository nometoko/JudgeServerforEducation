import { useState, useEffect } from "react";
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
    Avatar,
} from "@chakra-ui/react";
import { DefaultLayout } from "../components/DefaultLayout";
import { useNavigate } from "react-router-dom";
import myaxios from "@/providers/axios_client";

const Account = () => {
    const authUserName = localStorage.getItem("authUserName");
    if (!authUserName) {
        return (
            <DefaultLayout>
                <h1>Invalid url</h1>
            </DefaultLayout>
        );
    }

    const [username, setUsername] = useState("User Name");
    const [email, setEmail] = useState("user@example.com");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    useEffect(() => {
        setUsername(localStorage.getItem("authUserName"));
    }, []);

    //const handleSave = () => {
    //    if (password !== confirmPassword) {
    //        setError("Passwords do not match");
    //        return;
    //    }
    //    setError("");
    //    myaxios.post("/change", {
    //        username,
    //        password,
    //    });
    //    alert("Account information updated successfully");
    //};

    console.log("username:", localStorage.getItem("authUserName"));

    const handleSave = async () => {
        // 入力チェック
        if (!password) {
            setError("新しいパスワードを入力してください");
            setMessage("");
            return;
        }
        if (password !== confirmPassword) {
            setError("パスワードが一致しません");
            setMessage("");
            return;
        }
        setError("");
        try {
            // APIにパスワード変更リクエストを送信
            const response = await myaxios.post("/change", {
                username,
                password,
            });
            // API側のレスポンスに応じた処理（ここでは例として200の場合を想定）
            if (response.data.success === true) {
                setMessage("Account information updated successfully");
                console.log("debug", response.data.success);
                // 必要に応じて、navigateで他ページへ遷移する
                // navigate("/some-path");
            } else {
                setError("An error occurred while updating the account");
                setMessage("");
                console.log("debug", response.data.success);
            }
        } catch (err) {
            setError("Failed to update account. Please try again.");
            setMessage("");
            console.error(err);
        }
    };

    return (
        <DefaultLayout>
            <Flex h="100vh" align="center" justify="center">
                <Box p="20" borderWidth="1px" borderRadius="lg" boxShadow="md" bg="white">
                    <VStack spacing="6">
                        <Heading size="lg" textAlign="center">
                            Account Settings
                        </Heading>
                        <Avatar name={username} size="xl" />
                        <FormControl>
                            <FormLabel>
                                Username</FormLabel>
                            <Input
                                type="text"
                                value={authUserName}
                                readOnly={true}
                            />
                        </FormControl>
                        {/* <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl> */}
                        <FormControl>
                            <FormLabel>New Password</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Confirm Password</FormLabel>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </FormControl>
                        {error && <Text color="red.500">{error}</Text>}
                        {message && <Text color="green.500">{message}</Text>}
                        <Button
                            bg="#81E6D9"
                            width="full"
                            shadow="md"
                            onClick={handleSave}
                            _hover={{ bg: "#38B2AC" }}
                        >
                            Save Changes
                        </Button>
                    </VStack>
                </Box>

            </Flex>
        </DefaultLayout>
    );
};

export default Account;
