import React, { useEffect, useState } from "react";
import axios from "axios";
import DefaultLayout from "@/components/DefaultLayout";
import SubmitForm from "@/components/SubmitForm";
import { problemWithStatus } from "./TestProblems";
import { ProblemWithTestcase, Testcase } from "../types/DbTypes";
import { Heading, Stack, Text, Divider } from '@chakra-ui/react';

const Problem: React.FC = () => {
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
                    <Text whiteSpace="pre-line">キーボード (標準入力)から文字を受け取り、その文字がアルファベットなら、次の処理を実行するプログラムを作成してください。\n
                        入力が大文字なら小文字に、小文字なら大文字に変換する。 ただし入力はEOF(Ctrl + D) を受け取るまで繰り返されます。</Text>
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
            <SubmitForm />
        </DefaultLayout>

    );
};

export default Problem;
