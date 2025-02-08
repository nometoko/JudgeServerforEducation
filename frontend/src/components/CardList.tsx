import { useState, useEffect } from 'react';
import { Stack, Checkbox } from '@chakra-ui/react';
import { Card, CardHeader, CardBody, Heading, Text, Icon, SimpleGrid, Spacer } from '@chakra-ui/react';
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

const sortByOpenDate = (a: problemWithStatus, b: problemWithStatus): number => {
    return new Date(a.Problem.OpenDate).getTime() - new Date(b.Problem.OpenDate).getTime();
};

export const CardList = ({ data }: CardListProps) => {
    data = data.sort(sortByOpenDate);
    const check_list = ["完了済みの課題も表示する", "未公開の課題も表示する"];
    const [checkedItems, setCheckedItems] = useState(new Array(check_list.length).fill(false));
    const navigate = useNavigate();

    const calculateRemainingTime = (closeDate: string) => {
        const now = new Date();
        const close = new Date(closeDate);
        const diff = close.getTime() - now.getTime();

        const absDiff = Math.abs(diff);
        const hours = Math.floor(absDiff / (1000 * 60 * 60));
        const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

        return diff >= 0 ? `${hours}時間 ${minutes}分 ${seconds}秒` : `- ${hours}時間 ${minutes}分 ${seconds}秒`;
    };

    return (
        <>
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

            <Stack mt={8}>
                <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing="20px">
                    {data.map((pws) => {
                        if (pws.Status && !checkedItems[0]) return null;
                        if (new Date() < new Date(pws.Problem.OpenDate) && !checkedItems[1]) return null;

                        const [remainingTime, setRemainingTime] = useState(calculateRemainingTime(pws.Problem.CloseDate));

                        useEffect(() => {
                            const timer = setInterval(() => {
                                setRemainingTime(calculateRemainingTime(pws.Problem.CloseDate));
                            }, 1000);
                            return () => clearInterval(timer);
                        }, []);

                        return (
                            <Card
                                key={pws.Problem.Id}
                                boxShadow={'dark-lg'}
                                cursor="pointer"
                                _hover={{ transform: "scale(1.05)", transition: "0.2s" }}
                                onClick={() => navigate(`/Problem/${pws.Problem.Id}`)}
                                width="100%"
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
                                    <br />
                                    <Text fontWeight={"bold"} color={remainingTime.includes('-') ? "red.500" : "black"}>
                                        締切まであと
                                        <br />
                                        {remainingTime}
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
            </Stack >
        </>
    );
};
