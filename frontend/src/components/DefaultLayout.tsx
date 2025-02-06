import { ChakraProvider, Box, Flex, theme } from "@chakra-ui/react";
// import { TopHeader } from "./TopHeader";
// import { SideMenu } from "./SideMenu";
import React, { ReactNode } from 'react';

interface DefaultLayoutProps {
    children: ReactNode;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
    return (
        <ChakraProvider theme={theme}>
            <Flex h="100vh" overflowY={'auto'} >
                {/* <TopHeader /> */}
                <Flex>
                    {/* <SideMenu /> */}
                    <Box w="70vw" ml="20vw">{children}</Box>
                </Flex>
            </Flex>
        </ChakraProvider>
    );
};

export default DefaultLayout;
