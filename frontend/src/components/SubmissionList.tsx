import { useEffect, useState } from "react";
import myaxios from "@/providers/axios_client";
import { Box, Card, CardHeader, CardBody, Heading, Text, Button } from "@chakra-ui/react";
import exp from "constants";

type SubmissionListProps = {
    submission_id: string;
    user_name: string;
    problem_id: Number;
    submitted_date: string;
    status: string;
}

const SubmissionBar = ({ submission }: { submission: SubmissionListProps }) => {
    const submissionDate = new Date(submission.submitted_date);
    const navigatePath = "/submission/" + submission.submission_id;

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
                as="a"
                href={submission.status === "WJ" ? undefined : navigatePath}
                disabled={submission.status === "WJ"}>
                Detail
            </Button>
        </Card >
    )
};

const SubmissionList = () => {
    const authUserName = localStorage.getItem("authUserName");
    const [submissions, setSubmissions] = useState<SubmissionListProps[]>([]);

    const getSubmissions = async () => {
        try {
            const response = await myaxios.get(`/handler/getSubmissionList/${authUserName}`);
            setSubmissions(response.data);
        } catch (err: any) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (authUserName) {
            console.log(authUserName);
            getSubmissions();
        }
    }, [authUserName]);

    return (
        <Box>
            {submissions.map((submission) => (
                <SubmissionBar submission={submission} />
            ))}
        </Box>
    );
}

export default SubmissionList;
