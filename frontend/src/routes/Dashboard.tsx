import { Container, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DefaultLayout } from "@/components/DefaultLayout";
import { CardList } from "@/components/CardList";
import myaxios from "@/providers/axios_client";
import { ProblemProps, ProblemWithStatus } from "@/types/DbTypes";
import { useAuth } from "@/providers/AuthContext";
import { AuthData } from "@/providers/AuthGuard";

const DashboardPage = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [problems, setProblems] = useState<ProblemWithStatus[]>([]);
  const [error, setError] = useState("");
  const [debug, setDebug] = useState("");
  const { setAuthInfo } = useAuth();

  useEffect(() => {
    const getProblems = async () => {
      try {
        const response = await myaxios.get(`/handler/getProblemList/`);
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
    getProblems();
  }, []);

  return (
    <DefaultLayout>
      <Box display="flex" flexDirection="column" justifyContent="space-between" mt="6">
        <CardList data={problems} />
      </Box>
    </DefaultLayout >
  );
};

export default DashboardPage;
