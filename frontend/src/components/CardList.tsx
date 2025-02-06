import {
    Card, CardBody, CardFooter,
    Button, Stack, Text, Heading, Divider, ButtonGroup, Box
} from '@chakra-ui/react';

export const CardList = ({ color, onClick }: { color: string; onClick: () => void }) => {
    return (
        <Card
            maxW="sm"
            cursor="pointer" // カーソルをポインターにする
            _hover={{ transform: "scale(1.05)", transition: "0.2s" }} // ホバー時に拡大
            onClick={onClick} // クリックイベントを適用
        >
            <CardBody>
                <Box
                    width="100%"
                    height="150px"
                    bg={color} // 色を props から受け取る
                    borderRadius="lg"
                    display="flex"

                >
                </Box>

                <Stack mt="6" spacing="3">
                    <Heading size="md">if, for</Heading>
                </Stack>
            </CardBody>
        </Card>
    );
};
