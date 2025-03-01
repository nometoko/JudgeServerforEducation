import { useEffect, useState } from "react";
import myaxios from "@/providers/axios_client";
import { Box, Card, CardHeader, CardBody, Divider, Heading, Select, Flex, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { SubmissionProps } from "@/types/DbTypes";
import { FaFilter } from "react-icons/fa";
import { LuListCheck } from "react-icons/lu";

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
                <Heading size="md">{submission.status}</Heading>
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
    const [statusList, setStatusList] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>();

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

        const statusSet = new Set(submissions.map((submission) => submission.status));
        setStatusList(Array.from(statusSet));
    }, [submissions]);

    // フィルタリング処理
    const filteredSubmissions = submissions.filter((submission) => {
        if (selectedProblemId && selectedProblemId !== submission.problem_id) {
            return false;
        }
        if (selectedStatus && selectedStatus !== submission.status) {
            return false;
        }
        return true;
    }
    );

    return (
        <Box>
            {/* タイトル + フィルターを横並び */}
            <Flex justifyContent="space-between" alignItems="center" mb={2}>
                <Flex alignItems="center" mt={5} >
                    <LuListCheck size={32} style={{ marginRight: "10px" }} /> {/* アイコンとテキストの間に隙間 */}
                    <Heading textAlign="left" >Results</Heading>
                </Flex>

                {/* フィルター機能 */}
                <Flex alignItems="center">
                    <FaFilter size="30px" color="gray" style={{ marginRight: "8px" }} />
                    <HStack width="100%" mx="3">
                        <Box width="50%">
                            <Box textAlign="left">Problem</Box>
                            <Select placeholder="All" mb={1} onChange={(e) => setSelectedProblemId(Number(e.target.value))}>
                                {uniqueProblems.map((problem) => (
                                    <option key={problem.problem_id} value={problem.problem_id}>
                                        {problem.name}
                                    </option>
                                ))}
                            </Select>
                        </Box>
                        <Box width="50%">
                            <Box textAlign="left">Status</Box>
                            <Select placeholder="All" mb={1} onChange={(e) => setSelectedStatus(e.target.value)}>
                                {statusList.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </Select>
                        </Box>
                    </HStack>
                </Flex>
            </Flex>

            <Divider />



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
