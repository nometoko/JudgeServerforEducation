import DefaultLayout from "@/components/DefaultLayout";
import myaxios from "@/providers/axios_client";
import SubmissionList from "@/components/SubmissionList";
import { Divider, Button, Flex, Box, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SubmissionProps, UserProps } from "@/types/DbTypes";
import { useParams } from "react-router-dom";
import Problem from "./Problem";

const Results: React.FC = () => {
    const [listHeight, setListHeight] = useState("auto");
    const [results, setResults] = useState<SubmissionProps[]>([]);
    const [user, setUser] = useState<UserProps>();
    const authUserName = localStorage.getItem("authUserName");

    useEffect(() => {
        const updateHeight = () => {
            const brElements = document.querySelectorAll('br').length * 16;
            const headerHeight = document.getElementById("results-header")?.offsetHeight || 0;
            const tableHeaderHeight = document.getElementById("table-header")?.offsetHeight || 0;
            const availableHeight = window.innerHeight - headerHeight - tableHeaderHeight - brElements - 40;
            setListHeight(`${availableHeight}px`);
        };

        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await myaxios.get(`/api/v1/users/${authUserName}`);
                setUser(response.data);
            } catch (err: any) {
                console.log(err);
            }
        };

        getUserInfo();
    }, []);


    const [userName, setUserName] = useState<string | null>(null);
    const [problemId, setProblemId] = useState<string | null>(null);

    useEffect(() => {
        const getSubmissions = async () => {
            try {
                if (!user) return;
                if (new Date(user.joined_date).getFullYear() === new Date().getFullYear()) {
                    const response = await myaxios.get(`/handler/getSubmissionList/${authUserName}`);
                    response.data.sort((a: SubmissionProps, b: SubmissionProps) =>
                        new Date(b.submitted_date).getTime() - new Date(a.submitted_date).getTime()
                    );
                    setResults(response.data);
                }
                else {
                    const response = await myaxios.get(`/handler/getSubmissionList/`);
                    response.data.sort((a: SubmissionProps, b: SubmissionProps) =>
                        new Date(b.submitted_date).getTime() - new Date(a.submitted_date).getTime()
                    );
                    setResults(response.data);
                }
            } catch (err: any) {
                console.log(err);
            }
        };

        getSubmissions();
    }, [user]);

    useEffect(() => {
        // クエリパラメータをURLSearchParamsで取得
        const params = new URLSearchParams(location.search);  // location.search = '?problemId=1&difficulty=hard'
        const problemIdString = params.get('problem');
        const userName = params.get('user');

        setProblemId(problemIdString);
        setUserName(userName);
    }, [location.search]);

    return (
        <DefaultLayout>
            <Box flex="1" overflowY="auto" maxHeight={630}>
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
