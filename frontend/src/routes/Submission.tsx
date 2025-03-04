import CompileError from "@/components/CompileError";
import DefaultLayout from "@/components/DefaultLayout";
import SubmitContent from "@/components/SubmitContent";
import TestCaseResultList from "@/components/TestCaseResultList";
import myaxios from "@/providers/axios_client";
import { SubmissionProps } from "@/types/DbTypes";
import { Divider, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Submission = () => {
    const navigate = useNavigate();
    const { submissionId } = useParams<{ submissionId: string }>();
    const [loading, setLoading] = useState<boolean>(true);

    if (!submissionId) {
        return (
            <DefaultLayout>
                <h1>Invalid url</h1>
            </DefaultLayout>
        );
    }

    const [submission, setSubmission] = useState<SubmissionProps>();

    useEffect(() => {
        const getSubmission = async () => {
            try {
                console.log("🔄 提出情報を取得...");
                const response = await myaxios.get(`/api/v1/submission/id/${submissionId}`);
                setSubmission(response.data);
                setLoading(false);
            }
            catch (err: any) {
                console.error(err);
                setSubmission(undefined);
            }
        };

        getSubmission();
    }, []);

    const [problemName, setProblemName] = useState<string | null>(null);
    useEffect(() => {
        const getProblemName = async () => {
            try {
                console.log("🔄 問題名を取得...");
                const response = await myaxios.get(`/api/v1/problem/${submission?.problem_id}`);
                setProblemName(response.data.name);
            }
            catch (err: any) {
                console.error(err);
            }
        };
        if (submission) {
            getProblemName();
        }
    }, [submission]);

    if (loading) {
        return (
            <DefaultLayout>
                <h1>Waiting Judge...</h1>
            </DefaultLayout>
        );
    }
    else if (!submission) {
        return (
            <DefaultLayout>
                <h1>Submission not found</h1>
            </DefaultLayout>
        );
    }
    else {
        return (
            <DefaultLayout>
                <Heading
                    my={3}
                    onClick={() => navigate(`/problem/${submission.problem_id}`)}
                    cursor="pointer"
                >
                    {problemName}
                </Heading>
                <Divider />

                <SubmitContent submissionId={submissionId} />
                {/* statusがCEならCompileError, それ以外ならTestCaseResultList */}
                {submission.status === "CE" ?
                    <CompileError compileError={submission.compile_error || "Unknown compile error"} /> :
                    <TestCaseResultList submissionId={submissionId} />
                }
            </DefaultLayout>
        );
    }
};

export default Submission;
