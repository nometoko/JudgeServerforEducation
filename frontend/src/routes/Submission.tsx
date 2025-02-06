import React, { useEffect, useState } from "react";
import axios from "axios";
import DefaultLayout from "@/components/DefaultLayout";
import { problemWithStatus } from "./TestProblems";
import { ProblemWithTestcase, Testcase } from "../types/DbTypes";
import { Heading, Stack, Text, Divider } from '@chakra-ui/react';

const FileUpload: React.FC = () => {
    const [files, setFiles] = useState<FileList | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiles(event.target.files);
    };

    const handleUpload = async () => {
        // const [pwt, setPwt] = useState<problemWithStatus>()


        if (!files || files.length === 0) {
            setMessage("ファイルを選択してください。");
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);  // "files" はFastAPIの引数と一致
        }

        setUploading(true);
        setMessage("");

        try {
            const response = await axios.post("http://localhost:8000/uploadfiles/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setMessage(`アップロード成功: ${response.data.filenames}`);
        } catch (error) {
            console.error("Upload error:", error);
            setMessage("アップロードに失敗しました。");
        } finally {
            setUploading(false);
        }
    };

    return (
        <DefaultLayout>
            <Heading my={3}>if文, for文</Heading>
            <Divider />
            <Stack my={6}>
                {/* <ExecutionConstraints
                    executionTime={pwt?.ExecutionTime}
                    memoryLimit={pwt?.MemoryLimit}
                /> */}
                <Stack mt={4} mb={8}>
                    <Text
                        fontSize={24}
                        fontWeight={'bold'}
                    >
                        問題文
                    </Text>
                    <Text whiteSpace="pre-line">Statement</Text>
                </Stack>
                <Stack mb={8}>
                    <Text
                        fontSize={24}
                        fontWeight={'bold'}
                    >
                        制約
                    </Text>
                    <Text whiteSpace="pre-line">キーボード (標準入力)から文字を受け取り、その文字がアルファベットなら、次の処理を実行するプログラムを作成してください。 入力が大文字なら小文字に、小文字なら大文字に変換する。 ただし入力はEOF(Ctrl + D) を受け取るまで繰り返されます。</Text>
                </Stack>
                <Stack mb={8}>
                    <Text
                        fontSize={24}
                        fontWeight={'bold'}
                    >
                        入力形式
                    </Text>
                    <Text whiteSpace="pre-line">InputFmt</Text>
                </Stack>
                <Stack mb={8}>
                    <Text
                        fontSize={24}
                        fontWeight={'bold'}
                    >
                        出力形式
                    </Text>
                    <Text whiteSpace="pre-line">OutputFmt</Text>
                </Stack>
            </Stack>
            <Divider />
            <div>
                <h2>複数ファイルアップロード</h2>
                <input type="file" multiple onChange={handleFileChange} />
                <button onClick={handleUpload} disabled={uploading}>
                    {uploading ? "アップロード中..." : "アップロード"}
                </button>
                {message && <p>{message}</p>}
            </div>
        </DefaultLayout>

    );
};

export default FileUpload;
