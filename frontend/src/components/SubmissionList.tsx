import { useEffect, useState } from "react";
import myaxios from "@/providers/axios_client";
import { Box, Card, CardHeader, CardBody, Heading, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ProblemProps, SubmissionProps } from "@/types/DbTypes";

const SubmissionBar: React.FC<{ submission: SubmissionProps }> = ({ submission }) => {
    const navigate = useNavigate();
    const submissionDate = new Date(submission.submitted_date);
    const [problem, setProblem] = useState<ProblemProps>();

    const getProblemById = async () => {
        try {
            const response = await myaxios.get(`/api/v1/problem/${submission.problem_id}`);
            setProblem(response.data);
        } catch (err: any) {
            console.log(err);
        }
    }

    useEffect(() => {
        getProblemById();
    }, []);

    return (
        <Card
            key={submission.submission_id}
            direction={{ base: 'column', sm: 'row' }}
            // AC: green, WJ: gray, otherwise: red
            bg={submission.status === "AC" ? "green.100" : submission.status === "WJ" ? "gray.100" : "red.100"}
        >
            <CardHeader>
                <Heading size="sm">
                    {problem?.name}
                </Heading>
            </CardHeader>
            <CardBody>
                {submissionDate.toLocaleString()}
            </CardBody>
            <CardBody>
                {submission.status}
            </CardBody>
            <Button
                onClick={() => navigate(`/submission/${submission.submission_id}`)}
                disabled={submission.status === "WJ"}>
                Detail
            </Button>
        </Card >
    )
};

const SubmissionList: React.FC = () => {
    const authUserName = localStorage.getItem("authUserName");
    const [submissions, setSubmissions] = useState<SubmissionProps[]>([]);

    const sortBySubmittedDate = (a: SubmissionProps, b: SubmissionProps): number => {
        return new Date(b.submitted_date).getTime() - new Date(a.submitted_date).getTime();
    }

    const getSubmissions = async () => {
        try {
            const response = await myaxios.get(`/handler/getSubmissionList/${authUserName}`);
            response.data.sort(sortBySubmittedDate);
            setSubmissions(response.data);
        } catch (err: any) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (authUserName) {
            getSubmissions();
        }
    }, [authUserName]);

    if (submissions.length === 0) {
        return (
            <Box>
                No submission found
            </Box>
        );
    }

    return (
        <Box>
            {submissions.map((submission) => (
                <SubmissionBar submission={submission} key={submission.submission_id} />
            ))}
        </Box>
    );
}

export default SubmissionList;
