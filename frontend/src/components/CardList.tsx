import { useState, useEffect } from 'react';
import { Stack, Checkbox } from '@chakra-ui/react';
import { Card, CardHeader, CardBody, Heading, Text, Icon, SimpleGrid } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import { MdLockClock, MdLockOpen } from "react-icons/md";
import { GiPodium } from "react-icons/gi";

export interface Problem {
  problem_id: string;
  is_petit_coder: boolean;
  name: string;
  open_date: string;
  close_date: string;
}

export interface problemWithStatus {
  problem: Problem;
  status: boolean;
}

export interface CardListProps {
  data: problemWithStatus[];
}

const sortByOpenDate = (a: problemWithStatus, b: problemWithStatus): number => {
  return new Date(a.problem.open_date).getTime() - new Date(b.problem.open_date).getTime();
};

const CardItem = ({ pws }: { pws: problemWithStatus }) => {
  const navigate = useNavigate();

  // 残り時間計算用の関数
  const calculateRemainingTime = (close_date: string) => {
    const now = new Date();
    const close = new Date(close_date);
    const diff = close.getTime() - now.getTime();

    const absDiff = Math.abs(diff);
    const hours = Math.floor(absDiff / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

    return diff >= 0
      ? `${hours}時間 ${minutes}分 ${seconds}秒`
      : `- ${hours}時間 ${minutes}分 ${seconds}秒`;
  };

  // タイマー更新用のステートとエフェクト
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime(pws.problem.close_date));

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(calculateRemainingTime(pws.problem.close_date));
    }, 1000);
    return () => clearInterval(timer);
  }, [pws.problem.close_date]);

  return (
    <Card
      key={pws.problem.problem_id}
      boxShadow="dark-lg"
      cursor="pointer"
      _hover={{ transform: "scale(1.05)", transition: "0.2s" }}
      onClick={() => navigate(`/Problem/${pws.problem.problem_id}`)}
      width="100%"
    >
      <CardHeader>
        <Heading size="md">
          {pws.problem.is_petit_coder && <Icon as={GiPodium} w={6} h={6} mr="10px" />}
          {pws.problem.name}
        </Heading>
      </CardHeader>
      <CardBody>
        <Text fontWeight="bold">
          <Icon as={MdLockOpen} w={5} h={5} mr="5px" />
          {new Date(pws.problem.open_date).toLocaleString()}
        </Text>
        <Text fontWeight="bold">
          <Icon as={MdLockClock} w={5} h={5} mr="5px" />
          {new Date(pws.problem.close_date).toLocaleString()}
        </Text>
        <br />
        <Text fontWeight="bold" color={remainingTime.includes('-') ? "red.500" : "black"}>
          締切まであと
          <br />
          {remainingTime}
        </Text>
        {pws.status && (
          <Text
            bg="red.500"
            w="100%"
            h="20%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            color="white"
            rounded="xl"
            mt="3"
            fontWeight="bold"
          >
            DONE!!
          </Text>
        )}
      </CardBody>
    </Card>
  );
};

export const CardList = ({ data }: CardListProps) => {
  // 公開日時でソート
  data = data.sort(sortByOpenDate);
  const check_list = ["完了済みの課題も表示する", "未公開の課題も表示する"];
  const [checkedItems, setCheckedItems] = useState(new Array(check_list.length).fill(false));

  return (
    <>
      <Stack spacing={5} direction="row">
        {check_list.map((check, index) => (
          <Checkbox
            key={check}
            isChecked={checkedItems[index]}
            onChange={(e) =>
              setCheckedItems([
                ...checkedItems.slice(0, index),
                e.target.checked,
                ...checkedItems.slice(index + 1),
              ])
            }
          >
            {check}
          </Checkbox>
        ))}
      </Stack>

      <Stack mt={8}>
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing="20px">
          {data.map((pws) => {
            // フィルタリング処理
            if (pws.status && !checkedItems[0]) return null;
            if (new Date() < new Date(pws.problem.open_date) && !checkedItems[1]) return null;
            // 内部コンポーネント CardItem を利用することで、
            // ここでは条件分岐によりフックの呼び出し順が変わる問題を回避
            return <CardItem key={pws.problem.problem_id} pws={pws} />;
          })}
        </SimpleGrid>
      </Stack>
    </>
  );
};
