import myaxios from "@/providers/axios_client";
import { SubmissionProps, TestCaseResultProps } from "@/types/DbTypes";
import { Box, Code } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import TestCaseResult from "@/components/TestcaseResult";

const CompileError: React.FC<{ compileError: string }> = ({ compileError }) => {
    return (
        <Box>
            <h2>Compile Error</h2>
            <Code
                p={2}
                bg="gray.100"
                rounded="md"
                display="block"
                whiteSpace="pre-wrap"
                textAlign={"left"}
            >
                {compileError}
            </Code>
        </Box>
    )
}

const TestCaseResultList: React.FC<{ submissionId: string }> = ({ submissionId }) => {
    const authUserName = localStorage.getItem("authUserName")
    const [submission, setSubmission] = useState<SubmissionProps>();
    const [testcaseResults, setTestcaseResults] = useState<TestCaseResultProps[]>([]);

    const sortByTestcaseNumber = (a: TestCaseResultProps, b: TestCaseResultProps) => {
        return a.testcase.testcase_number - b.testcase.testcase_number;
    }

    useEffect(() => {
        myaxios.get(`/handler/getTestcaseResultList/${authUserName}/${submissionId}`)
            .then((response) => {
                response.data.sort(sortByTestcaseNumber);
                setTestcaseResults(response.data);
            }
            );
        myaxios.get(`/api/v1/submission/${authUserName}/${submissionId}`)
            .then((response) => {
                setSubmission(response.data);
            }
            );
    }, []);

    if (submission && submission.status === "CE" && submission.compile_error) {
        return (
            <Box>
                <CompileError compileError={submission.compile_error} />
            </Box>
        )
    }
    else {
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
}

export default TestCaseResultList;
