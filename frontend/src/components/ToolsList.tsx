import { useNavigate } from "react-router-dom";
import { Box, Stack, Divider, Flex } from '@chakra-ui/react';
import { Card, CardHeader, CardBody, Heading, Text, SimpleGrid, Icon } from '@chakra-ui/react';
import { FaUsers, FaGamepad, FaQuestionCircle } from "react-icons/fa"; // アイコンをインポート

const ToolsItem = ({ title, path, icon }: { title: string, path: string, icon: any }) => {
    const navigate = useNavigate();

    return (
        <Card
            boxShadow="xl"
            border="1px solid"
            borderColor="gray.300"
            cursor="pointer"
            background="white"
            _hover={{ transform: "scale(1.05)", transition: "0.2s" }}
            onClick={() => navigate(path)}
            width="100%"
            p={4}
        >
            <CardHeader>
                <Flex alignItems="center">
                    <Icon as={icon} boxSize={10} color="gray.800" mr={2} /> {/* アイコンを追加 */}
                    <Heading size="md">{title}</Heading>
                </Flex>
            </CardHeader>
            <CardBody>
                <Text>Click to explore {title}</Text>
            </CardBody>
        </Card>
    );
};

const ToolsList = () => {
    const tools = [
        { title: "Lab Members", path: "/lab-members", icon: FaUsers },
        { title: "Games", path: "/games", icon: FaGamepad },
        { title: "Mini Quiz", path: "/mini-quiz", icon: FaQuestionCircle },
    ];

    return (
        <Stack mt="4">
            <SimpleGrid columns={{ sm: 1, md: 2, lg: 2 }} spacing="20px">
                {tools.map((tool) => (
                    <ToolsItem key={tool.path} title={tool.title} path={tool.path} icon={tool.icon} />
                ))}
            </SimpleGrid>
        </Stack>
    );
};

export default ToolsList;
