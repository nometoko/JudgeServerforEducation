import CompileError from "@/components/CompileError";
import DefaultLayout from "@/components/DefaultLayout";
import SubmitContent from "@/components/SubmitContent";
import TestCaseResultList from "@/components/TestCaseResultList";
import myaxios from "@/providers/axios_client";
import { SubmissionProps, UserProps } from "@/types/DbTypes";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

    const authUserName = localStorage.getItem("authUserName");
    const [user, setUser] = useState<UserProps>();
    const [submission, setSubmission] = useState<SubmissionProps>();

    useEffect(() => {
        const getSubmission = async () => {
            try {
                if (!user) return;
                if (!authUserName) return;
                if (new Date(user.joined_date).getFullYear() === new Date().getFullYear()) {
                    const response = await myaxios.get(`/api/v1/submission/${authUserName}/${submissionId}`);
                    setSubmission(response.data);
                }
                else {
                    const response = await myaxios.get(`/api/v1/submission/id/${submissionId}`);
                    setSubmission(response.data);
                }
            }
            catch (err: any) {
                console.error(err);
                setSubmission(undefined);
            }
        };

        getSubmission();
        setLoading(false);
    }, [user]);

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await myaxios.get(`/api/v1/users/${authUserName}`);
                setUser(response.data);
            } catch (err: any) {
                console.error(err);
            }
        };

        getUserInfo();
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
