import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DefaultLayout } from "@/components/DefaultLayout";
import { CardList } from "@/components/CardList";
import myaxios from "@/providers/axios_client";
import { ProblemWithStatus } from "@/types/DbTypes";

const DashboardPage = () => {
  const [problems, setProblems] = useState<ProblemWithStatus[]>([]);

  useEffect(() => {
    const getProblems = async () => {
      try {
        const response = await myaxios.get(`/handler/getProblemList/`);
        // 成功時は問題リストとメッセージを更新
        setProblems(response.data);
      } catch (err: any) {
        // エラーがあればエラーメッセージを表示
        console.log("error in getProblemList", err)
        setProblems([]);
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
