import { useState } from 'react';
import { Stack, Checkbox } from '@chakra-ui/react';
import { Card, CardHeader, CardBody, Heading, Text, Icon, SimpleGrid } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import { MdLockClock, MdLockOpen } from "react-icons/md";
import { GiPodium } from "react-icons/gi";

export interface Problem {
    Id: string;
    Name: string;
    OpenDate: string;
    CloseDate: string;
    IsPetitCoder: boolean;
}

export interface problemWithStatus {
    Problem: Problem;
    Status: boolean;
}

export interface CardListProps {
    data: problemWithStatus[];
}

// ✅ OpenDate でソートする関数
const sortByOpenDate = (a: problemWithStatus, b: problemWithStatus): number => {
    return new Date(a.Problem.OpenDate).getTime() - new Date(b.Problem.OpenDate).getTime();
};

export const CardList = ({ data }: CardListProps) => {
    // ✅ `data` を OpenDate でソート
    data = data.sort(sortByOpenDate);

    const check_list = ["完了済みの課題も表示する", "未公開の課題も表示する"];
    const [checkedItems, setCheckedItems] = useState(new Array(check_list.length).fill(false));
    const navigate = useNavigate();

    return (
        <>
            {/* ✅ フィルタリングのチェックボックス */}
            <Stack spacing={5} direction='row'>
                {check_list.map((check, index) => (
                    <Checkbox
                        key={check}
                        isChecked={checkedItems[index]}
                        onChange={(e) => setCheckedItems([...checkedItems.slice(0, index), e.target.checked, ...checkedItems.slice(index + 1)])}
                    >
                        {check}
                    </Checkbox>
                ))}
            </Stack>

            {/* ✅ カード一覧 */}
            <Stack mt={8}>
                <SimpleGrid columns={{ sm: 2, md: 3, lg: 4 }} spacing="20px">
                    {data.map((pws) => {
                        // ✅ チェックボックスの状態に応じたフィルタリング
                        if (pws.Status && !checkedItems[0]) return null;
                        if (new Date() < new Date(pws.Problem.OpenDate) && !checkedItems[1]) return null;

                        return (
                            <Card
                                key={pws.Problem.Id}
                                boxShadow={'dark-lg'}
                                cursor="pointer" // ✅ クリック可能なカーソル
                                _hover={{ transform: "scale(1.05)", transition: "0.2s" }} // ✅ ホバー時のアニメーション
                                onClick={() => navigate("/Submission/${pws.Problem.Id}")} // ✅ カード自体がクリック可能
                            >
                                <CardHeader>
                                    <Heading size='md'>
                                        {pws.Problem.IsPetitCoder && <Icon as={GiPodium} w={6} h={6} mr="10px" />}
                                        {pws.Problem.Name}
                                    </Heading>
                                </CardHeader>
                                <CardBody>
                                    <Text fontWeight={"bold"}>
                                        <Icon as={MdLockOpen} w={5} h={5} mr="5px" />
                                        {new Date(pws.Problem.OpenDate).toLocaleString()}
                                    </Text>
                                    <Text fontWeight={"bold"}>
                                        <Icon as={MdLockClock} w={5} h={5} mr="5px" />
                                        {new Date(pws.Problem.CloseDate).toLocaleString()}
                                    </Text>
                                    {pws.Status && (
                                        <Text
                                            bg="red.500"
                                            w='100%'
                                            h="20%"
                                            display='flex'
                                            justifyContent="center"
                                            alignItems="center"
                                            color="white"
                                            rounded={'xl'}
                                            mt="3"
                                            fontWeight={"bold"}
                                        >
                                            DONE!!
                                        </Text>
                                    )}
                                </CardBody>
                            </Card>
                        );
                    })}
                </SimpleGrid>
            </Stack>
        </>
    );
};
