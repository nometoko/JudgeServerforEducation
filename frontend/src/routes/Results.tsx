import DefaultLayout from "@/components/DefaultLayout";
import myaxios from "@/providers/axios_client";
import SubmissionList from "@/components/SubmissionList";
import { Button } from "@chakra-ui/react";

const Results = () => {
    const getProblems = async () => {
        try {
            const response = await myaxios.get(`/api/v1/submission/{user_name}`);
        } catch (err: any) {
            console.error(err);
        }
    }

    return (
        <DefaultLayout>
            <div>
                <h1>Results</h1>
            </div>
            <SubmissionList />
        </DefaultLayout>
    );
};

export default Results;
