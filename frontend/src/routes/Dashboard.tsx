import { Container } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DefaultLayout } from "@/components/DefaultLayout";
import { CardList } from "@/components/CardList";
import myaxios from "@/providers/axios_client";
import { ProblemProps, ProblemWithStatus } from "@/types/DbTypes";

const DashboardPage = () => {
  const authUserName = localStorage.getItem("authUserName");
  const [problems, setProblems] = useState<ProblemWithStatus[]>([]);
  const [error, setError] = useState("");
  const [debug, setDebug] = useState("");

  const getProblems = async () => {
    try {
      const response = await myaxios.get(`/handler/getProblemList/${authUserName}`); // ✅ ユーザー名を渡す
      // 成功時は問題リストとメッセージを更新
      setProblems(response.data);
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
      </Container>
    </DefaultLayout>
  );
};

export default DashboardPage;
