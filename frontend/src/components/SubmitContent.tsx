import { Box, Button, Flex, Select, Tooltip, useClipboard } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { GoCopy, GoDownload } from "react-icons/go";

type SubmittedFile = {
    content: string;
    filename: string;
}


const SubmitContent: React.FC = () => {
    const [files, setFiles] = React.useState<SubmittedFile[]>([]);
    const [selectedFileContent, setSelectedFileContent] = React.useState<string>('');
    const [selectedFileName, setSelectedFileName] = React.useState<string>('');
    const { onCopy, setValue, hasCopied } = useClipboard('');
    const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValue(e.target.value);
        setSelectedFileContent(e.target.value);
        const fileName = e.target.selectedOptions[e.target.tabIndex].text;
        setSelectedFileName(fileName);
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
        const blob = new Blob([selectedFileContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = selectedFileName;
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    useEffect(() => {
        fetch("http://localhost:8000/getfilelist")
            .then((response) => response.json())
            .then(
                (data) => {
                    setFiles(data)
                    setSelectedFileContent(data[0].content)
                }
            );
    }, []);

    return (
        <div>
            <Flex mt={5}>
                <Select onChange={(e) => handleSelectChange(e)} width="100%">
                    {files.map((file) => (
                        <option key={file.filename} value={file.content}>{file.filename}</option>
                    ))}
                </Select>
                <Tooltip label={hasCopied ? 'Copied!' : 'Copy raw file'} placement='top' fontSize='12' isOpen={isTooltipOpen || undefined}>
                    <Button onClick={handleCopy}>
                        <GoCopy />
                    </Button>
                </Tooltip>
                <Tooltip label="Download raw file" placement='top' fontSize='12'>
                    <Button onClick={handleDownload}>
                        <GoDownload />
                    </Button>
                </Tooltip>
            </Flex>
            <Box height="60vh" width="100%">
                <SyntaxHighlighter language="c" style={oneDark} children={selectedFileContent} />
            </Box>
        </div>
    );
}

export default SubmitContent;
