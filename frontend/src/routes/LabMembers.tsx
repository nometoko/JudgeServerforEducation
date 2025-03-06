import DefaultLayout from "@/components/DefaultLayout";
import LabMembersList from "@/components/LabMembersList"

import { Heading, Divider, Button, Flex, Box } from "@chakra-ui/react";
import { FaUsers } from "react-icons/fa"; // アイコンをインポート





const LabMembers = () => {
    return (
        <DefaultLayout>
            <Box flex="1" overflowY="auto">
                {/* タイトル + フィルターを横並び */}
                <Flex justifyContent="space-between" alignItems="center" >
                    {/* Results タイトル */}
                    <Flex alignItems="center" mt={5} >
                        <FaUsers size={32} style={{ marginRight: "10px" }} /> {/* アイコンとテキストの間に隙間 */}
                        <Heading textAlign="left" >LabMembers</Heading>
                    </Flex>
                </Flex>
                <br />
                <Divider />
                <LabMembersList />
            </Box>
        </DefaultLayout>
    );
};

export default LabMembers;
