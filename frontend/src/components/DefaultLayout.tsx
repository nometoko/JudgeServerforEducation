import { ChakraProvider, Box, Flex, VStack, Button, Image, Avatar, Text } from "@chakra-ui/react";
import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { LuListCheck } from "react-icons/lu";
import { FaTableCellsRowLock } from "react-icons/fa6";
import { AiFillTool } from "react-icons/ai";
import { useState } from "react";
import { AuthData } from "../providers/AuthGuard";
import { myaxios } from "../providers/axios_client";


interface DefaultLayoutProps {
    children: ReactNode;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    //const authUserName = localStorage.getItem("authUserName");
    const [authData, setAuthData] = useState<AuthData | null>(null);
    const [username, setUsername] = useState<string>("");


    useEffect(() => {
        const fetchAuthData = async () => {
            try {
                const response = await myaxios.get("/protected");
                setAuthData(response.data);
            } catch (error) {
                console.error("認証情報の取得エラー:", error);
            } finally {
                //setLoading(false);
            }
        };
        fetchAuthData();
    }, []);

    useEffect(() => {
        if (authData) {
            setUsername(authData.authUserName);
        }
    }, [authData]);


    const iconsize = 21
    const iconwidth = "8px"

    return (
        <ChakraProvider >
            <Flex w="100vw" h="100vh">
                {/* ✅ 左側の固定サイドバー */}
                <Box w="250px" h="100vh" bg="gray.800" color="white" p={4} display="flex" flexDirection="column" justifyContent="space-between">
                    <VStack spacing={4} align="stretch">
                        <a href="https://fun.bio.keio.ac.jp/" target="_blank" rel="noopener noreferrer">
                            <Image src="http://localhost:8000/static/photos/m1/rkimura_is_fighting.jpg" alt="funalab logo" boxSize="100px" mb={4} cursor="pointer" />
                        </a>
                        <Button variant="ghost" colorScheme="whiteAlpha" onClick={() => navigate("/dashboard")} justifyContent={"flex-start"}>
                            <MdDashboard size={iconsize} /> {/* アイコンを追加 */}
                            <Box w={iconwidth} />
                            Dashboard
                        </Button>
                        <Button variant="ghost" colorScheme="whiteAlpha" onClick={() => navigate("/results")} justifyContent={"flex-start"}>
                            <LuListCheck size={iconsize} />
                            <Box w={iconwidth} />
                            Results
                        </Button>
                        <Button variant="ghost" colorScheme="whiteAlpha" onClick={() => navigate("/b3status")} justifyContent={"flex-start"}>
                            <FaTableCellsRowLock size={iconsize} />
                            <Box w={iconwidth} />
                            B3 Status
                        </Button>
                        <Button variant="ghost" colorScheme="whiteAlpha" onClick={() => navigate("/tools")} justifyContent={"flex-start"}>
                            <AiFillTool size={iconsize} />
                            <Box w={iconwidth} />
                            Tools
                        </Button>
                    </VStack>

                    {/* ✅ アカウント情報（並列表示 & Box全体がボタン） */}
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="left"
                        borderRadius="md"
                        p={3}
                        cursor="pointer"
                        onClick={() => navigate("/account")}
                        _hover={{ bg: "gray.600" }}
                    >
                        <Avatar name={username} src="../../img/user-avatar.png" size="md" mr={3} />
                        <Text fontSize="lg" fontWeight="bold">{username}</Text>
                    </Box>
                </Box>

                {/* ✅ 右側のスクロール可能なメインコンテンツ */}
                <Box flex="1" overflowY="auto" p={6}>
                    {children}
                </Box>
            </Flex>
        </ChakraProvider>
    );
};

export default DefaultLayout;
