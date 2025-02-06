import { ChakraProvider, Box, Flex, VStack, Button, Image, theme } from "@chakra-ui/react";
import React, { ReactNode } from 'react';
import { useNavigate } from "react-router-dom";

interface DefaultLayoutProps {
    children: ReactNode;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
    const navigate = useNavigate();

    return (
        // <ChakraProvider >
        <Flex w="100vw" h="100vh">
            {/* ✅ 左側の固定サイドバー */}
            <Box w="250px" h="100vh" bg="gray.800" color="white" p={4}>
                <VStack spacing={4} align="stretch">
                    <Image src="../../img/funalab.png" alt="funalab logo" boxSize="80px" mb={4} />
                    <Button variant="ghost" colorScheme="whiteAlpha" onClick={() => navigate("/dashboard")}>
                        Dashboard
                    </Button>
                    <Button variant="ghost" colorScheme="whiteAlpha" onClick={() => navigate("/results")}>
                        Results
                    </Button>
                    <Button variant="ghost" colorScheme="whiteAlpha" onClick={() => navigate("/tools")}>
                        Tools
                    </Button>
                </VStack>
            </Box>

            {/* ✅ 右側のスクロール可能なメインコンテンツ */}
            <Box flex="1" overflowY="auto" p={6}>
                {children}
            </Box>
        </Flex>
        // </ChakraProvider>
    );
};

export default DefaultLayout;
