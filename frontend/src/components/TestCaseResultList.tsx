import myaxios from "@/providers/axios_client";
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Flex, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ReactDiffViewer from "react-diff-viewer";

type TestCaseProps = {
    testcase_number: number;
    args_file_content: string;
    stdin_file_content: string;
    answer_file_content: string;
}

type TestCaseUserResultProps = {
    output_content: string;
    status: string;
}

type TestCaseResultProps = {
    testcase: TestCaseProps;
    user_result: TestCaseUserResultProps;
}

const TestCaseResult: React.FC<TestCaseResultProps> = ({ testcase, user_result }) => {
    const executedCommand = "prog " + testcase.args_file_content;

    return (
        <Accordion allowToggle>
            <AccordionItem>
                <h2>
                    <AccordionButton bg={user_result.status === "AC" ? "green.200" : "red.200"}>
                        <Box flex="1" textAlign="left">
                            Test Case {testcase.testcase_number}
                        </Box>
                        <Box flex="1" textAlign="center">
                            {user_result.status}
                        </Box>
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                    <Flex>
                        <Box>
                            <h3>Executed Command</h3>
                            <Textarea value={executedCommand} readOnly />
                        </Box>

                        <Box>
                            <h3>Standard Input</h3>
                            <Textarea value={testcase.stdin_file_content} readOnly />
                        </Box>
                    </Flex>
                    <ReactDiffViewer
                        newValue={testcase.answer_file_content}
                        oldValue={user_result.output_content}
                        splitView={true}
                        leftTitle="your output"
                        rightTitle="expected output"
                        showDiffOnly={false}
                    />
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    )
}

type SubmissionResultProps = {
    submissionId: string;
}

const TestCaseResultList: React.FC<SubmissionResultProps> = ({ submissionId }) => {
    const [testcaseResults, setTestcaseResults] = useState<TestCaseResultProps[]>([]);

    const authUserName = localStorage.getItem("authUserName");

    useEffect(() => {
        const data = myaxios.get(`/handler/getTestcaseResultList/${submissionId}`)
            .then((response) => {
                console.log(response.data);
                setTestcaseResults(response.data);
            }
            );
    }, []);

    return (
        <Box>
            {testcaseResults.map((testcase) => (
                <TestCaseResult testcase={testcase.testcase} user_result={testcase.user_result} />
            ))}
        </Box>
    )
}

export default TestCaseResultList;
