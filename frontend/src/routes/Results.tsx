import DefaultLayout from "@/components/DefaultLayout";
import myaxios from "@/providers/axios_client";
import SubmissionList from "@/components/SubmissionList";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SubmissionProps } from "@/types/DbTypes";

const Results: React.FC = () => {
    const [results, setResults] = useState<SubmissionProps[]>([]);
    const [userName, setUserName] = useState<string | null>(null);
    const [problemId, setProblemId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getSubmissions = async () => {
            try {
                const response = await myaxios.get(`/handler/getSubmissionList/`);
                response.data.sort((a: SubmissionProps, b: SubmissionProps) =>
                    new Date(b.submitted_date).getTime() - new Date(a.submitted_date).getTime()
                );
                setResults(response.data);
                if (response.data.some((submission: SubmissionProps) => submission.status === "WJ")) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setLoading(!loading);
                }
            } catch (err: any) {
                console.log(err);
            }
        };
        getSubmissions();
    }, [loading]);

    useEffect(() => {
        // クエリパラメータをURLSearchParamsで取得
        const params = new URLSearchParams(location.search);
        const problemIdString = params.get('problem');
        const userName = params.get('user');

        setProblemId(problemIdString);
        setUserName(userName);
    }, [location.search]);

    return (
        <DefaultLayout>
            <Box flex="1" >
                <SubmissionList
                    submissions={results}
                    defaultUserName={userName || undefined}
                    defaultProblemId={problemId ? parseInt(problemId) : undefined}
                />
            </Box>
        </DefaultLayout>
    );
};

export default Results;
