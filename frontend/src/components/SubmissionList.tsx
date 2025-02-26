import { useEffect, useState } from "react";
import myaxios from "@/providers/axios_client";
import { Box, Card, CardHeader, CardBody, Heading } from "@chakra-ui/react";
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
            direction="row"
            display="flex"
            alignItems="center"  // 垂直方向の中央揃え
            justifyContent="space-between"  // 均等配置
            bg={submission.status === "AC" ? "green.100" : submission.status === "WJ" ? "gray.100" : "red.100"}
            cursor={submission.status === "WJ" ? "not-allowed" : "pointer"}
            onClick={() => {
                if (submission.status !== "WJ") {
                    navigate(`/submission/${submission.submission_id}`);
                }
            }}
            _hover={submission.status === "AC" ? { bg: "green.200" } : submission.status !== "AC" && submission.status !== "WJ" ? { bg: "red.200" } : {}}
            h="50px"  // 高さを固定
            minH="50px"
            maxH="80px"
            p={2}
        >
            {/* 問題名 */}
            <CardHeader p={2} flex="1" textAlign="left">
                <Heading size="sm">{problem?.name}</Heading>
            </CardHeader>

            {/* 提出日時 */}
            <CardBody p={2} flex="1" textAlign="left" >
                {submissionDate.toLocaleString()}
            </CardBody>

            {/* ステータス */}
            <CardBody p={2} flex="1" textAlign="left" >
                {submission.status}
            </CardBody>
        </Card>


    );
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
                <Box key={submission.submission_id} mb={1}>
                    <SubmissionBar submission={submission} />
                </Box>
            ))}
        </Box>
    );
}

export default SubmissionList;
