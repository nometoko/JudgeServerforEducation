import { ChakraProvider, Box, Flex, VStack, Button, Image, Avatar, Text, theme } from "@chakra-ui/react";
import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

interface DefaultLayoutProps {
    children: ReactNode;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const authUserName = localStorage.getItem("authUserName");

    return (
        <ChakraProvider >
            <Flex w="100vw" h="100vh">
                {/* ✅ 左側の固定サイドバー */}
                <Box w="250px" h="100vh" bg="gray.800" color="white" p={4} display="flex" flexDirection="column" justifyContent="space-between">
                    <VStack spacing={4} align="stretch">
                        <a href="https://fun.bio.keio.ac.jp/" target="_blank" rel="noopener noreferrer">
                            <Image src="../../img/funalab.png" alt="funalab logo" boxSize="80px" mb={4} cursor="pointer" />
                        </a>
                        <Button variant="ghost" colorScheme="whiteAlpha" onClick={() => navigate("/dashboard")} justifyContent={"flex-start"}>
                            Dashboard
                        </Button>
                        <Button variant="ghost" colorScheme="whiteAlpha" onClick={() => navigate("/results")} justifyContent={"flex-start"}>
                            Results
                        </Button>
                        <Button variant="ghost" colorScheme="whiteAlpha" onClick={() => navigate("/b3status")} justifyContent={"flex-start"}>
                            B3 Status
                        </Button>
                        <Button variant="ghost" colorScheme="whiteAlpha" onClick={() => navigate("/tools")} justifyContent={"flex-start"}>
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
                        <Avatar name={authUserName} src="../../img/user-avatar.png" size="md" mr={3} />
                        <Text fontSize="lg" fontWeight="bold">{authUserName}</Text>
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
