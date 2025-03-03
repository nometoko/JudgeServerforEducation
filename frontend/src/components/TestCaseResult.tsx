import { JudgeStatus, TestCaseResultProps } from "@/types/DbTypes";
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Button, Flex, Textarea, Tooltip, useClipboard } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { GoCopy, GoDownload } from "react-icons/go";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";

const TestCaseResultHeader: React.FC<{ title: string, content: string }> = ({ title, content }) => {
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

const ResultViewer: React.FC<{ title: string, content: string }> = ({ title, content }) => {
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

  return (
    <Accordion allowToggle onChange={handleAccordionChange}>
      <AccordionItem isDisabled={user_result.status === "WJ"}>
        <h2>
          <AccordionButton bg={user_result.status === "AC" ? "green.200" : user_result.status === "WJ" ? "gray.200" : "red.200"}>
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
          {/* 10000行以上はreact-diff-viewerがクソ重くなるのでTextareaで表示 */}
          {Math.max(countLines(user_result.output_content), countLines(testcase.answer_file_content)) > 10000 ? (
            <Box>
              <text>"Too many lines to display in diff style" </text>
              <Flex>
                <ResultViewer title="Your Output" content={user_result.output_content} />
                <ResultViewer title="Expected Output" content={testcase.answer_file_content} />
              </Flex>
            </Box>
          ) : (
            <Box>
              <Flex justifyContent="space-between" fontWeight="bold" mb={2}>
                <TestCaseResultHeader title="Your Output" content={user_result.output_content} />
                <TestCaseResultHeader title="Expected Output" content={testcase.answer_file_content} />
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

export default TestCaseResult;
