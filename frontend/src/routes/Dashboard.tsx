import { Container } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DefaultLayout } from "../components/DefaultLayout";
import { CardList } from "../components/CardList";
import { dummyProblems } from "./TestProblems"; // ✅ `data.ts` からインポート
import myaxios from  "../providers/axios_client";
import { Myaxios_provider } from '../providers/axios_client';

const DashboardPage = () => {
    const authUserName = localStorage.getItem("authUserName");
    const [problems, setProblems] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [debug, setDebug] = useState("");

    const getProblems = async () => {
        try {
          const response = await myaxios.get(`/getProblemList/${authUserName}`);
          // 成功時は問題リストとメッセージを更新
          setProblems(response.data.problems);
          setDebug(response.data.message);
          setError("");
        } catch (err: any) {
          // エラーがあればエラーメッセージを表示
          if (err.response && err.response.status === 404) {
            setError("User not found");
          } else {
            setError("Error fetching problems");
          }
          setProblems([]);
          setDebug("");
        }
      };

      useEffect(() => {
        if (authUserName) {
          getProblems();
        } else {
          setError("No authenticated user found");
        }
      }, [authUserName]);

    return (
        <DefaultLayout>
            <Container maxW="xl" p={6}>
                <CardList data={problems} />
                {/*<CardList data={dummyProblems} />*/}
            </Container>
        </DefaultLayout>
    );
};

export default DashboardPage;
