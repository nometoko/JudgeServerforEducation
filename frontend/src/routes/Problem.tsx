import DefaultLayout from "@/components/DefaultLayout";
import SubmitForm from "@/components/SubmitForm";
import myaxios from "@/providers/axios_client";
import { ProblemProps } from "@/types/DbTypes";
import { Heading, Stack, Text, Divider } from '@chakra-ui/react';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Problem: React.FC = () => {
    const { problemId } = useParams<{ problemId: string }>();
    const [problem, setProblem] = useState<ProblemProps>();

    const getProblem = async () => {
        try {
            const response = await myaxios.get(`/api/v1/problem/${problemId}`);
            console.log(response.data);
            setProblem(response.data);
        } catch (err: any) {
            console.log(err);
        }
    }

    useEffect(() => {
        console.log("useEffect");
        getProblem();
    }, [problemId]);

    if (!problem) {
        return (
            <DefaultLayout>
                <h1>Problem not found</h1>
            </DefaultLayout>
        );
    }
    else {
        return (
            <DefaultLayout>
                <Heading my={3}>{problem.name}</Heading>
                <Divider />
                <Stack my={6}>
                    {/* <ExecutionConstraints
                    executionTime={pwt?.ExecutionTime}
                    memoryLimit={pwt?.MemoryLimit}
                /> */}
                    <Stack mt={4} mb={8}>
                        <Text
                            fontSize={28}
                            fontWeight={'bold'}
                            textAlign={'left'}
                        >
                            問題文
                        </Text>
                        <Text whiteSpace="pre-line" textAlign={'left'} fontSize={18}>{problem.statement}</Text>
                    </Stack>
                    <Stack mb={8}>
                        <Text
                            fontSize={28}
                            fontWeight={'bold'}
                            textAlign={'left'}
                        >
                            制約
                        </Text>
                        <Text whiteSpace="pre-line" textAlign={'left'} fontSize={18}>{problem.constraints}</Text>
                    </Stack>
                    <Stack mb={8}>
                        <Text
                            fontSize={28}
                            fontWeight={'bold'}
                            textAlign={'left'}
                        >
                            入力形式
                        </Text>
                        <Text whiteSpace="pre-line" textAlign={'left'} fontSize={18}>{problem.input_format}</Text>
                    </Stack>
                    <Stack mb={8}>
                        <Text
                            fontSize={28}
                            fontWeight={'bold'}
                            textAlign={'left'}
                        >
                            出力形式
                        </Text>
                        <Text whiteSpace="pre-line" textAlign={'left'} fontSize={18}>{problem.output_format}</Text>
                    </Stack>
                </Stack>
                <Divider />
                <SubmitForm problemId={Number(problemId)} />
            </DefaultLayout>
        );
    }
};

export default Problem;
