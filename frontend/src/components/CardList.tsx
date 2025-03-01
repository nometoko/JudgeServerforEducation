import { useState, useEffect } from 'react';
import { Box, Stack, Checkbox, Divider } from '@chakra-ui/react';
import { Card, CardHeader, CardBody, Heading, Text, Icon, SimpleGrid } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import { MdLockClock, MdLockOpen } from "react-icons/md";
import { GiPodium } from "react-icons/gi";
import { ProblemWithStatus } from '@/types/DbTypes';

const CardItem = ({ pws }: { pws: ProblemWithStatus }) => {
  const navigate = useNavigate();

  // 残り時間計算用の関数
  const calculateRemainingTime = (close_date: string) => {
    const now = new Date();
    const close = new Date(close_date);
    const diff = close.getTime() - now.getTime();

    const absDiff = Math.abs(diff);
    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(absDiff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

    let timeString = "";
    if (days > 0) timeString += `${days}日 `;
    if (hours > 0 || days > 0) timeString += `${hours}時間 `;
    timeString += `${minutes}分`;

    return diff >= 0 ? timeString : `-${timeString}`;
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
      boxShadow="xl"
      border="1px solid"
      borderColor="gray.300"
      cursor="pointer"
      background={pws.status ? "green.100" : "white"}
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
      <Box px={4}>
        <Divider borderColor="gray.400" />
      </Box>
      <CardBody>
        <Text textAlign="left">
          <Icon as={MdLockClock} w={5} h={5} mr="5px" />
          {new Date(pws.problem.close_date).toLocaleString()}
        </Text >
        <br />
        <Text fontWeight="bold" color={remainingTime.includes('-') ? "red.500" : "black"}>
          締切まであと
          <br />
          {remainingTime}
        </Text>
        {pws.status && (
          <Text
            bg="white"
            w="100%"
            h="20%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            color="green.500"
            rounded="xl"
            mt="3"
            fontWeight="bold"
          >
            DONE!!
          </Text>
        )}
      </CardBody>
    </Card >
  );
};


export const CardList = ({ data }: { data: ProblemWithStatus[] }) => {
  // 公開日時でソート

  const sortByProblemId = (a: ProblemWithStatus, b: ProblemWithStatus): number => {
    return a.problem.problem_id - b.problem.problem_id;
  };

  data = data.sort(sortByProblemId);
  const check_list = ["完了済みの課題も表示する", "未公開の課題も表示する"];

  // ローカルストレージから初期値を取得
  const storedChecks = localStorage.getItem("checkedItems");
  const initialCheckedState = storedChecks ? JSON.parse(storedChecks) : new Array(check_list.length).fill(false);

  const [checkedItems, setCheckedItems] = useState<boolean[]>(initialCheckedState);

  // チェック状態をローカルストレージに保存
  useEffect(() => {
    localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
  }, [checkedItems]);

  return (
    <>
      <Stack spacing={5} direction="row" mb="4">
        {check_list.map((check, index) => (
          <Checkbox
            key={check}
            isChecked={checkedItems[index]}
            onChange={(e) => {
              const newCheckedItems = [
                ...checkedItems.slice(0, index),
                e.target.checked,
                ...checkedItems.slice(index + 1),
              ];
              setCheckedItems(newCheckedItems);
            }}
          >
            {check}
          </Checkbox>
        ))}
      </Stack>
      <Box >
        <Divider borderWidth="1px" borderColor="gray.200" />
      </Box>

      <Stack mt="4">
        <SimpleGrid columns={{ sm: 1, md: 3, lg: 5 }} spacing="20px">
          {data.map((pws) => {
            // フィルタリング処理
            if (pws.status && !checkedItems[0]) return null;
            if (new Date() < new Date(pws.problem.open_date) && !checkedItems[1]) return null;
            return <CardItem key={pws.problem.problem_id} pws={pws} />;
          })}
        </SimpleGrid>
      </Stack>
    </>
  );
};
