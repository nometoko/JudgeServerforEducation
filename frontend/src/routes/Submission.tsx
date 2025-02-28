import DefaultLayout from "@/components/DefaultLayout";
import SubmitContent from "@/components/SubmitContent";
import TestCaseResultList from "@/components/TestCaseResultList";
import myaxios from "@/providers/axios_client";
import { SubmissionProps } from "@/types/DbTypes";
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

    const [authUserName, setAuthUserName] = useState<string | null>(null);
    const [submission, setSubmission] = useState<SubmissionProps>();
    const [authData, setAuthData] = useState<AuthData | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const fetchAuthData = async () => {
          try {
            const response = await myaxios.get("/protected");
            setAuthData(response.data);
          } catch (error) {
            console.error("認証情報の取得エラー:", error);
            setErrorMessage("認証情報の取得に失敗しました。");
          } finally {
            //setLoading(false);
          }
        };
        fetchAuthData();
      }, []);

      useEffect(() => {
        if (authData) {
        setAuthUserName(authData.authUserName);
        }
    }, [authData]);

    const getSubmission = async () => {
        try {
            const response = await myaxios.get(`/api/v1/submission/${authUserName}/${submissionId}`);
            setSubmission(response.data);
        }
        catch (err: any) {
            console.error(err);
            setSubmission(undefined);
        }
    }

    useEffect(() => {
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
                <TestCaseResultList submissionId={submissionId} />
            </DefaultLayout>
        );
    }
};

export default Submission;
