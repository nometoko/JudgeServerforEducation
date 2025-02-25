import DefaultLayout from "@/components/DefaultLayout";
import SubmitContent from "@/components/SubmitContent";
import TestCaseResultList from "@/components/TestCaseResultList";
import myaxios from "@/providers/axios_client";
import { SubmissionProps } from "@/types/DbTypes";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Submission = () => {
    const { submissionId } = useParams<{ submissionId: string }>();
    const [submission, setSubmission] = useState<SubmissionProps>();

    const getSubmission = async () => {
        try {
            const response = await myaxios.get(`/api/v1/submission/id/${submissionId}`);
            setSubmission(response.data);
        }
        catch (err: any) {
            console.error(err);
            setSubmission(undefined);
        }
    }

    useEffect(() => {
        getSubmission();
    }, []);

    if (!submission) {
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
                <TestCaseResultList submissionId={submissionId} />
            </DefaultLayout>
        );
    }
};

export default Submission;
