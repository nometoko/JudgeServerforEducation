import { JudgeStatus, TestCaseResultProps } from "@/types/DbTypes";
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Button, Code, Divider, Flex, Textarea, Tooltip, useClipboard } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { GoCopy, GoDownload } from "react-icons/go";
import ReactDiffViewer from "react-diff-viewer-continued";

const TestCaseResultHeader: React.FC<{ title: string, content: string }> = ({ title, content }) => {
  const { onCopy, hasCopied } = useClipboard(content);
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
    a.download = `${formatString(title)}.txt`;
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <Box width="100%">
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
    </Box>
  );
}

const ResultViewer: React.FC<{ status: string, userOutput: string, expectedOutput: string }> = ({ status, userOutput, expectedOutput }) => {

  const countLines = (text: string) => {
    return text.split(/\r\n|\r|\n/).length;
  };

  if (status === "AC" || status === "WA") {
    if (Math.max(countLines(userOutput), countLines(expectedOutput)) > 10000) {
      return (
        <Box>
          <text>"Too many lines to display in diff style" </text>
          <Flex>
            <ResultTextArea title="Your Output" content={userOutput} />
            <ResultTextArea title="Expected Output" content={expectedOutput} />
          </Flex>
        </Box>
      )
    }
    else {
      return (
        <Box>
          <Flex justifyContent="space-between" fontWeight="bold" mb={2}>
            <TestCaseResultHeader title="Your Output" content={userOutput} />
            <TestCaseResultHeader title="Expected Output" content={expectedOutput} />
          </Flex>
          <Box maxHeight={300} overflowY="auto">
            <ReactDiffViewer
              newValue={expectedOutput}
              oldValue={userOutput}
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
      )
    }
  }
  else {
    return (
      <Box maxHeight={300} overflowY="auto">
        <Code whiteSpace={"pre-wrap"} textAlign={"left"} width={"100%"}>
          {userOutput}
        </Code>
      </Box>
    )
  }
}

const ResultTextArea: React.FC<{ title: string, content: string }> = ({ title, content }) => {
  return (
    <Box>
      <h3>{title}</h3>
      <Textarea value={content} readOnly />
    </Box>
  )
}
const TestCaseResult: React.FC<TestCaseResultProps> = ({ testcase, user_result }) => {
  const executedCommand = "./a.out " + testcase.args_file_content;

  const panelRef = useRef<HTMLDivElement | null>(null);
  const { onCopy: copyStdin, hasCopied: hasCopiedStdin } = useClipboard(testcase.stdin_file_content);
  const [isTooltipOpenStdin, setIsTooltipOpenStdin] = useState(false);

  const handleAccordionChange = () => {
    setTimeout(() => {
      if (panelRef.current) {
        panelRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 10);
  };

  const handleCopyStdin = () => {
    copyStdin();
    setIsTooltipOpenStdin(true);
    setTimeout(() => {
      setIsTooltipOpenStdin(false);
    }, 1000);
  };

  return (
    <Accordion allowToggle onChange={handleAccordionChange}>
      <AccordionItem isDisabled={user_result.status === "WJ"}>
        <h2>
          <AccordionButton
            bg={user_result.status === "AC" ? "green.100" : user_result.status === "WJ" ? "gray.200" : "red.100"}
            _hover={user_result.status === "AC" ? { bg: "green.200" } : user_result.status === "WJ" ? { bg: "gray.200" } : { bg: "red.200" }}
          >
            <Box textAlign="left" width="80%">
              Test Case {testcase.testcase_number}
            </Box>
            <Tooltip label={JudgeStatus[user_result.status as keyof typeof JudgeStatus]} placement="top-start">
              <Box textAlign="left" width="20%">
                {user_result.status}
              </Box>
            </Tooltip>
          </AccordionButton>
        </h2>
        <AccordionPanel p={4} ref={panelRef}>
          <Flex mt="2">
            <Box flex="1" mr={4}>
              <h3>Executed Command</h3>
              <Box position="relative" mt="2">
                <Textarea value={executedCommand} readOnly />
              </Box>
            </Box>

            <Box flex="1" position="relative">
              <h3 >Standard Input</h3>
              <Box position="relative" mt="2">
                <Textarea value={testcase.stdin_file_content} readOnly />
                <Tooltip label={hasCopiedStdin ? "Copied!" : "Copy"} placement="top" fontSize="12" isOpen={isTooltipOpenStdin}>
                  <Button
                    position="absolute"
                    top="5px"
                    right="5px"
                    size="sm"
                    onClick={handleCopyStdin}
                    bg="gray.100"
                    _hover={{ bg: "whiteAlpha.900" }}
                  >
                    <GoCopy />
                  </Button>
                </Tooltip>
              </Box>
            </Box>
            {testcase.args_file_content.length > 0 && (
              <Box flex="1" position="relative">
                <h3>Input File Content</h3>
                <Box position="relative" mt="2">
                  <Textarea value={testcase.input_file_content} readOnly />
                </Box>
              </Box>
            )}
          </Flex>
          <br />
          <Divider />
          <br />
          <ResultViewer status={user_result.status} userOutput={user_result.output_content} expectedOutput={testcase.answer_file_content} />
        </AccordionPanel>
      </AccordionItem>
    </Accordion >
  );
};

export default TestCaseResult;
