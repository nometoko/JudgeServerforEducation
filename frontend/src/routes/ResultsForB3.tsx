import DefaultLayout from "@/components/DefaultLayout";
import myaxios from "@/providers/axios_client";
import SubmissionList from "@/components/SubmissionList";
import { Divider, Button, Flex, Box, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Problem {
    problem_id: number;
    name: string;
}

const ResultsForB3 = () => {
    const [listHeight, setListHeight] = useState("auto");
    const [problems, setProblems] = useState<Problem[]>([]);
    const [selectedProblem, setSelectedProblem] = useState<number | null>(null);

    useEffect(() => {
        const updateHeight = () => {
            const brElements = document.querySelectorAll('br').length * 16;
            const headerHeight = document.getElementById("results-header")?.offsetHeight || 0;
            const tableHeaderHeight = document.getElementById("table-header")?.offsetHeight || 0;
            const availableHeight = window.innerHeight - headerHeight - tableHeaderHeight - brElements - 40;
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

            <Box flex="1" overflowY="auto" maxHeight={630}>
                {/* フィルタリング機能を `SubmissionList` に適用 */}
                <SubmissionList />
            </Box>
        </DefaultLayout>
    );
};

export default ResultsForB3;
