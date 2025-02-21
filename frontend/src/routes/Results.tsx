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

    const deleteAllSubmission = async () => {
        try {
            const response = await myaxios.delete(`/api/v1/submission/`);
        } catch (err: any) {
            console.error(err);
        }
    }

    const getAllSubmission = async () => {
        try {
            const response = await myaxios.get(`/api/v1/submission/`);
            console.log(response.data);
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
            <Button onClick={getAllSubmission}>Get All Submissions</Button>
            <Button onClick={deleteAllSubmission}>Delete All Submissions</Button>

        </DefaultLayout>
    );
};

export default Results;
