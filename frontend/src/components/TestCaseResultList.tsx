import myaxios from "@/providers/axios_client";
import { TestCaseResultProps } from "@/types/DbTypes";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import TestCaseResult from "@/components/TestCaseResult";

const TestCaseResultList: React.FC<{ submissionId: string }> = ({ submissionId }) => {
    const [testcaseResults, setTestcaseResults] = useState<TestCaseResultProps[]>([]);

    const sortByTestcaseNumber = (a: TestCaseResultProps, b: TestCaseResultProps) => {
        return a.testcase.testcase_number - b.testcase.testcase_number;
    }

    useEffect(() => {
        myaxios.get(`/handler/getTestcaseResultList/${submissionId}`)
            .then((response) => {
                response.data.sort(sortByTestcaseNumber);
                setTestcaseResults(response.data);
            }
            );
    }, []);
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
