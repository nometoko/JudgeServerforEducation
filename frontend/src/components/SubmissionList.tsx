import { useEffect, useState } from "react";
import myaxios from "@/providers/axios_client";
import { Box, Card, CardHeader, CardBody, Heading, Text, Button } from "@chakra-ui/react";
import exp from "constants";
import { useNavigate } from "react-router-dom";
import { LuCornerDownLeft } from "react-icons/lu";
import { SubmissionProps } from "@/types/DbTypes";

const SubmissionBar = ({ submission }: { submission: SubmissionProps }) => {
    const navigate = useNavigate();
    const submissionDate = new Date(submission.submitted_date);

    return (
        <Card
            key={submission.submission_id}
            direction={{ base: 'column', sm: 'row' }}
            // AC: green, WJ: gray, otherwise: red
            bg={submission.status === "AC" ? "green.100" : submission.status === "WJ" ? "gray.100" : "red.100"}
        >
            <CardHeader>
                <Heading size="sm">
                    {String(submission.problem_id)} - {submission.status}
                </Heading>
            </CardHeader>
            <CardBody>
                <Text>
                    {submissionDate.toLocaleString()}
                </Text>
            </CardBody>
            <Button
                onClick={() => navigate(`/submission/${submission.submission_id}`)}
                disabled={submission.status === "WJ"}>
                Detail
            </Button>
        </Card >
    )
};

const SubmissionList = () => {
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
