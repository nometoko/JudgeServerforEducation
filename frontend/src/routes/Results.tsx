import DefaultLayout from "@/components/DefaultLayout";
import myaxios from "@/providers/axios_client";
import SubmissionList from "@/components/SubmissionList";
import { Divider, Button, Flex, Box, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Problem {
    problem_id: number;
    name: string;
}

const Results = () => {
    const [listHeight, setListHeight] = useState("auto");
    const [problems, setProblems] = useState<Problem[]>([]);
    const [selectedProblem, setSelectedProblem] = useState<number | null>(null);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await myaxios.get("/api/v1/problem/list");
                setProblems(response.data);
            } catch (err) {
                console.log("Error fetching problems", err);
            }
        };

        fetchProblems();
    }, []);

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

            {/* プルダウン選択 UI */}
            <Select placeholder="Select a problem" onChange={(e) => setSelectedProblem(Number(e.target.value))}>
                {problems.map((problem) => (
                    <option key={problem.problem_id} value={problem.problem_id}>
                        {problem.name}
                    </option>
                ))}
            </Select>
            <br />

            <Box>
                <Flex id="table-header" justifyContent="space-between" fontWeight="bold" mb={1}>
                    <Box flex="1" textAlign="left" bg="gray.600" border="1px solid white" color='white' p={3} fontSize="lg">Problem</Box>
                    <Box flex="1" textAlign="left" bg="gray.600" border="1px solid white" color='white' p={3} fontSize="lg">Submitted at</Box>
                    <Box flex="1" textAlign="left" bg="gray.600" border="1px solid white" color='white' p={3} fontSize="lg">Status</Box>
                </Flex>
                <Box flex="1" overflowY="auto" maxHeight={630}>
                    {/* フィルタリング機能を `SubmissionList` に適用 */}
                    <SubmissionList selectedProblem={selectedProblem} />
                </Box>
            </Box>
        </DefaultLayout>
    );
};

export default Results;
