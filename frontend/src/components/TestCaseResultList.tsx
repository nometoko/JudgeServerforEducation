import myaxios from "@/providers/axios_client";
import { SubmissionProps, TestCaseResultProps } from "@/types/DbTypes";
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Button, Code, Flex, Textarea, Tooltip, useClipboard } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { GoCopy, GoDownload } from "react-icons/go";
import ReactDiffViewer from "react-diff-viewer";

const TestCaseResult: React.FC<TestCaseResultProps> = ({ testcase, user_result }) => {
    const executedCommand = "./a.out " + testcase.args_file_content;

    const panelRef = useRef<HTMLDivElement | null>(null);

    const handleAccordionChange = () => {
        setTimeout(() => {
            if (panelRef.current) {
                panelRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        }, 10); // アニメーション完了後にスクロール
    };

    const countLines = (text: string) => {
        return text.split(/\r\n|\r|\n/).length;
    }

    const Header: React.FC<{ title: string, content: string }> = ({ title, content }) => {
        const { onCopy, setValue, hasCopied } = useClipboard(content);
        const [isTooltipOpen, setIsTooltipOpen] = useState(false);

        const formatString = (str: string): string => {
            return str.toLowerCase().replace(/ /g, "_");
        }

        const handleCopy = () => {
            onCopy();
            setIsTooltipOpen(true);
            setTimeout(() => {
                setIsTooltipOpen(false);
            }, 1000);
        }

        const handleDownload = () => {
            // download file
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `problem${testcase.problem_id}_testcase${testcase.testcase_number}_${formatString(title)}.txt`;
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        return (
            <Flex>
                <Box flex="1" textAlign="left" bg="gray" border="1px solid white" color='white' p={2}>{title}</Box>
                <Tooltip label={hasCopied ? 'Copied!' : 'Copy raw file'} placement='top' fontSize='12' isOpen={isTooltipOpen || undefined}>
                    <Button onClick={() => {
                        handleCopy();
                    }}>
                        <GoCopy />
                    </Button>
                </Tooltip>
                <Tooltip label="Download raw file" placement='top' fontSize='12'>
                    <Button onClick={handleDownload}>
                        <GoDownload />
                    </Button>
                </Tooltip>
            </Flex>
        )
    }

    return (
        <Accordion allowToggle onChange={handleAccordionChange}>
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
                <AccordionPanel pb={4} ref={panelRef}>
                    <Flex mt="2" >
                        <Box>
                            <h3>Executed Command</h3>
                            <Textarea value={executedCommand} readOnly />
                        </Box>

                        <Box>
                            <h3>Standard Input</h3>
                            <Textarea value={testcase.stdin_file_content} readOnly />
                        </Box>
                    </Flex>
                    <br />
                    {Math.max(countLines(user_result.output_content), countLines(testcase.answer_file_content)) > 10000 ? (
                        <Box>
                            <text>"Too many lines to display in diff style" </text>
                            <Flex>
                                <Box width="50%">
                                    <h3>Your Output</h3>
                                    <Textarea height={300} value={user_result.output_content} readOnly />
                                </Box>
                                <Box width="50%">
                                    <h3>Expected Output</h3>
                                    <Textarea height={300} value={testcase.answer_file_content} readOnly />
                                </Box>
                            </Flex>
                        </Box>
                    ) : (
                        <Box>
                            <Flex justifyContent="space-between" fontWeight="bold" mb={2}>
                                <Box width="50%">
                                    <Header title="Your Output" content={user_result.output_content} />
                                </Box>
                                <Box width={"50%"}>
                                    <Header title="Expected Output" content={testcase.answer_file_content} />
                                </Box>
                            </Flex>
                            <Box maxHeight={300} overflowY="auto">
                                <ReactDiffViewer
                                    newValue={testcase.answer_file_content}
                                    oldValue={user_result.output_content}
                                    splitView={true}
                                    showDiffOnly={false}
                                    styles={{
                                        line: {
                                            wordBreak: "break-all",
                                        },
                                        contentText: {
                                            textAlign: "left",
                                        },
                                    }}
                                />
                            </Box>
                        </Box>
                    )}
                </AccordionPanel>
            </AccordionItem >
        </Accordion >
    )
}

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
