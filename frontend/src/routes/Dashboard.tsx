import { Grid, GridItem } from "@chakra-ui/react";
import { DefaultLayout } from "../components/DefaultLayout";
import { CardList } from "../components/CardList";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
    const navigate = useNavigate();

    // ランダムな色を取得する関数
    const getRandomColor = () => {
        const colors = ["red.300", "blue.300", "green.300", "yellow.300", "purple.300"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    // カードクリック時の処理
    const handleCardClick = (index: number) => {
        navigate(`/Submission`, { replace: true });
    };

    return (
        <DefaultLayout>
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                {Array.from({ length: 40 }).map((_, index) => (
                    <GridItem key={index}>
                        <CardList
                            color={getRandomColor()} // ランダムな色を適用
                            onClick={() => handleCardClick(index)} // クリック時の処理を適用
                        />
                    </GridItem>
                ))}
            </Grid>
        </DefaultLayout>
    );
};

export default DashboardPage;
