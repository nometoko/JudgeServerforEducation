import { useEffect, useState } from "react";
import myaxios from "@/providers/axios_client";
import { Box, Card, CardHeader, CardBody, Heading, Select, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { SubmissionProps } from "@/types/DbTypes";

const getProblemNameById = async (problemId: number): Promise<string | undefined> => {
    try {
        const response = await myaxios.get(`/api/v1/problem/${problemId}`);
        return response.data.name;
    } catch (err: any) {
        console.log(err);
    }
}

const SubmissionBar: React.FC<{ submission: SubmissionProps }> = ({ submission }) => {
    const navigate = useNavigate();
    const submissionDate = new Date(submission.submitted_date);
    const [problemName, setProblemName] = useState<string>();

    useEffect(() => {
        getProblemNameById(submission.problem_id).then((name) => setProblemName(name));
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
                <Heading size="sm">{problemName}</Heading>
            </CardHeader>

            {/* 提出日時 */}
            <CardBody p={2} flex="1" textAlign="left" >
                {submissionDate.toLocaleString()}
            </CardBody>

            {/* ステータス */}
            <CardBody p={2} flex="1" textAlign="left" fontSize="2xl">
                {submission.status}
            </CardBody>
        </Card>
    );
};


const SubmissionList: React.FC = () => {
    interface ProblemSimpleProps {
        problem_id: number;
        name: string;
    }

    const authUserName = localStorage.getItem("authUserName");
    const [submissions, setSubmissions] = useState<SubmissionProps[]>([]);
    const [selectedProblemId, setSelectedProblemId] = useState<number>();
    const [uniqueProblems, setUniqueProblems] = useState<ProblemSimpleProps[]>([]);

    const getSubmissions = async () => {
        try {
            const response = await myaxios.get(`/handler/getSubmissionList/${authUserName}`);
            response.data.sort((a: SubmissionProps, b: SubmissionProps) =>
                new Date(b.submitted_date).getTime() - new Date(a.submitted_date).getTime()
            );
            setSubmissions(response.data);
        } catch (err: any) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (authUserName) {
            getSubmissions();
        }
    }, [authUserName]);

    useEffect(() => {
        const fetchProblemNames = async () => {
            const uniqueProblemIds = Array.from(new Set(submissions.map((submission) => submission.problem_id)));
            const uProblems = await Promise.all(uniqueProblemIds.map(async (problemId) => {
                const problemName = await getProblemNameById(problemId);
                return {
                    problem_id: problemId,
                    name: problemName ?? "Unknown Problem" // undefined の場合のデフォルト値
                };
            }));
            uProblems.sort((a, b) => a.problem_id - b.problem_id);
            setUniqueProblems(uProblems);
        };
        fetchProblemNames();
    }, [submissions]);

    // フィルタリング処理
    const filteredSubmissions = selectedProblemId
        ? submissions.filter((submission) => submission.problem_id === selectedProblemId)
        : submissions;

    return (
        <Box>
            < Select placeholder="Select a problem" onChange={(e) => setSelectedProblemId(Number(e.target.value))}>
                {
                    uniqueProblems.map((problem) => (
                        <option key={problem.problem_id} value={problem.problem_id}>
                            {problem.name}
                        </option>
                    ))
                }
            </Select >
            <br />

            <Flex id="table-header" justifyContent="space-between" fontWeight="bold" mb={1}>
                <Box flex="1" textAlign="left" bg="gray.600" border="1px solid white" color='white' p={3} fontSize="lg">Problem</Box>
                <Box flex="1" textAlign="left" bg="gray.600" border="1px solid white" color='white' p={3} fontSize="lg">Submitted at</Box>
                <Box flex="1" textAlign="left" bg="gray.600" border="1px solid white" color='white' p={3} fontSize="lg">Status</Box>
            </Flex>
            {filteredSubmissions.map((submission) => (
                <Box key={submission.submission_id} mb={1}>
                    <SubmissionBar submission={submission} />
                </Box>
            ))}
        </Box>
    );
};

export default SubmissionList;
