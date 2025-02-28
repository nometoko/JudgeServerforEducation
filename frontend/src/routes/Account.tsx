import { useState, useEffect, useRef } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Flex,
    VStack,
    Text,
    Avatar,
    AvatarBadge,
    VisuallyHiddenInput,
} from "@chakra-ui/react";
import { DefaultLayout } from "../components/DefaultLayout";
import { useNavigate } from "react-router-dom";
import myaxios from "@/providers/axios_client";

const Account = () => {
    const authUserName = localStorage.getItem("authUserName");
    if (!authUserName) {
        return (
            <DefaultLayout>
                <Flex h="100vh" align="center" justify="center">
                    <Text fontSize="2xl" color="red.500">Invalid URL</Text>
                </Flex>
            </DefaultLayout>
        );
    }

    const [username, setUsername] = useState(authUserName);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [avatar, setAvatar] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setUsername(authUserName);
    }, []);

    // ✅ パスワード変更処理
    const handleSave = async () => {
        setError("");
        setMessage("");

        if (!password) {
            setError("新しいパスワードを入力してください");
            return;
        }
        if (password !== confirmPassword) {
            setError("パスワードが一致しません");
            return;
        }

        try {
            const response = await myaxios.post("/change", { username, password });
            if (response.data.success) {
                setMessage("Account information updated successfully");
            } else {
                setError("An error occurred while updating the account");
            }
        } catch (err) {
            setError("Failed to update account. Please try again.");
        }
    };

    // ✅ 画像アップロード処理
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setAvatar(imageUrl);
        }
    };

    // ✅ アバターを元に戻す
    const resetAvatar = () => {
        if (avatar) {
            URL.revokeObjectURL(avatar); // メモリリークを防ぐ
        }
        setAvatar(null);
    };

    return (
        <DefaultLayout>
            <Flex h="100vh" align="center" justify="center">
                <Box p="10" borderWidth="1px" borderRadius="lg" boxShadow="md" bg="white" w="400px">
                    <VStack spacing="6">
                        <Heading size="lg" textAlign="center">
                            Account Settings
                        </Heading>

                        {/* ✅ アバターのカスタマイズ */}
                        <FormControl>
                            <Flex direction="column" align="center">
                                <Avatar size="xl" src={avatar || ""} name={username} mb="4" />
                                <Button colorScheme="gray" size="sm" onClick={() => fileInputRef.current?.click()}>
                                    画像をアップロード
                                </Button>
                                <VisuallyHiddenInput
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                />
                                {avatar && (
                                    <Button mt={2} colorScheme="gray" size="sm" onClick={resetAvatar}>
                                        元のアバターに戻す
                                    </Button>
                                )}
                            </Flex>
                        </FormControl>

                        {/* ✅ ユーザー名 */}
                        <FormControl>
                            <FormLabel>Username</FormLabel>
                            <Input type="text" value={authUserName} readOnly />
                        </FormControl>

                        {/* ✅ 新しいパスワード */}
                        <FormControl>
                            <FormLabel>New Password</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>

                        {/* ✅ 確認用パスワード */}
                        <FormControl>
                            <FormLabel>Confirm Password</FormLabel>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </FormControl>

                        {/* ✅ メッセージ表示 */}
                        {error && <Text color="red.500">{error}</Text>}
                        {message && <Text color="green.500">{message}</Text>}

                        {/* ✅ 保存ボタン */}
                        <Button
                            colorScheme="teal"
                            width="full"
                            shadow="md"
                            onClick={handleSave}
                            isDisabled={!password || !confirmPassword}
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
