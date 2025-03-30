import myaxios from "@/providers/axios_client";
import { TestCaseResultProps } from "@/types/DbTypes";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import TestCaseResult from "@/components/TestCaseResult";

const TestCaseResultList: React.FC<{ submissionId: string }> = ({ submissionId }) => {
    const [testcaseResults, setTestcaseResults] = useState<TestCaseResultProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const sortByTestcaseNumber = (a: TestCaseResultProps, b: TestCaseResultProps) => {
        return a.testcase.testcase_number - b.testcase.testcase_number;
    }

    useEffect(() => {
        const getTestcaseResults = async () => {
            console.log("🔄 テストケース結果を取得...")
            const response = await myaxios.get(`/handler/getTestcaseResultList/${submissionId}`);
            response.data.sort(sortByTestcaseNumber);
            setTestcaseResults(response.data);
            // WJのものがあればローディングを続ける
            if (response.data.some((result: TestCaseResultProps) => result.user_result.status === "WJ")) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                setLoading(!loading);
            }
        };
        getTestcaseResults();
    }, [loading, submissionId]);

    return (
        <Box>
            {testcaseResults.map((testcase) => (
                <TestCaseResult
                    key={testcase.testcase.testcase_number}
                    testcase={testcase.testcase}
                    user_result={testcase.user_result}
                />
            ))}
        </Box>
    )
}

export default TestCaseResultList;
