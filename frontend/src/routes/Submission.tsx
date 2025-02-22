import DefaultLayout from "@/components/DefaultLayout";
import SubmitContent from "@/components/SubmitContent";
import TestCaseResultList from "@/components/TestCaseResultList";
import { useParams } from "react-router-dom";

const Submission = () => {
    const { submissionId } = useParams<{ submissionId: string }>();

    if (!submissionId) {
        return <DefaultLayout>Invalid submission ID</DefaultLayout>;
    }

    return (
        <DefaultLayout>
            <SubmitContent submissionId={submissionId} />
            <TestCaseResultList submissionId={submissionId} />
        </DefaultLayout>
    );
};

export default Submission;
