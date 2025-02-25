import DefaultLayout from "@/components/DefaultLayout";
import myaxios from "@/providers/axios_client";
import SubmissionList from "@/components/SubmissionList";
import { Divider, Button, Flex, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Results = () => {
    const [listHeight, setListHeight] = useState("auto");

    useEffect(() => {
        const updateHeight = () => {
            const brElements = document.querySelectorAll('br').length * 16; // 1行分の高さを加味
            const headerHeight = document.getElementById("results-header")?.offsetHeight || 0;
            const tableHeaderHeight = document.getElementById("table-header")?.offsetHeight || 0;
            const availableHeight = window.innerHeight - headerHeight - tableHeaderHeight - brElements - 40; // 余白を確保
            setListHeight(`${availableHeight}px`);
        };

        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    return (
        <DefaultLayout>
            <div id="results-header" style={{ textAlign: "left" }}>
                <h1>Results</h1>
            </div>
            <br />
            <Divider borderWidth="1px" borderColor="black" />
            <br />

            <Box>
                <Flex id="table-header" justifyContent="space-between" fontWeight="bold" mb={1}>
                    <Box flex="1" textAlign="left" bg="gray.700" border="1px solid white" color='white' p={3} fontSize="lg">Problem</Box>
                    <Box flex="1" textAlign="left" bg="gray.700" border="1px solid white" color='white' p={3} fontSize="lg">Submitted at</Box>
                    <Box flex="1" textAlign="left" bg="gray.700" border="1px solid white" color='white' p={3} fontSize="lg">Status</Box>
                </Flex>
                <Box flex="1" overflowY="auto" maxHeight={630}>
                    <SubmissionList />
                </Box>
            </Box>
        </DefaultLayout>
    );
};

export default Results;
