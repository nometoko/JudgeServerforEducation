import CompileError from "@/components/CompileError";
import DefaultLayout from "@/components/DefaultLayout";
import SubmitContent from "@/components/SubmitContent";
import TestCaseResultList from "@/components/TestCaseResultList";
import myaxios from "@/providers/axios_client";
import { SubmissionProps, UserProps } from "@/types/DbTypes";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthData } from "@/providers/AuthGuard";

const Submission = () => {
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
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const getSubmission = async () => {
            try {
                const response = await myaxios.get(`/api/v1/submission/id/${submissionId}`);
                setSubmission(response.data);

            }
            catch (err: any) {
                console.error(err);
                setSubmission(undefined);
            }
        };

        getSubmission();
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <DefaultLayout>
                <h1>Loading...</h1>
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
