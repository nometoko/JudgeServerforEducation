import DefaultLayout from "@/components/DefaultLayout";
import ToolsList from "@/components/ToolsList"
import { Heading, Divider, Button, Flex, Box } from "@chakra-ui/react";
import { AiFillTool } from "react-icons/ai";

const Tools = () => {
    return (
        <DefaultLayout>
            <Box flex="1" overflowY="auto" maxHeight={630}>
                {/* タイトル + フィルターを横並び */}
                <Flex justifyContent="space-between" alignItems="center" >
                    {/* Results タイトル */}
                    <Flex alignItems="center" mt={5} >
                        <AiFillTool size={32} style={{ marginRight: "10px" }} /> {/* アイコンとテキストの間に隙間 */}
                        <Heading textAlign="left" >Tools</Heading>
                    </Flex>
                </Flex>
                <br />
                <Divider />
                <ToolsList />
            </Box>
        </DefaultLayout>
    );
};

export default Tools;
