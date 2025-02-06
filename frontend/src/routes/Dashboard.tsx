import {
    Box,
    Container,
    Grid,
    GridItem,
    Image
} from "@chakra-ui/react";
import { DefaultLayout } from "../components/DefaultLayout";
import { CardList } from "../components/CardList"

const DashboardPage = () => {
    // ランダムな色を取得する関数
    const getRandomColor = () => {
        const colors = ["red.300", "blue.300", "green.300", "yellow.300", "purple.300"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    // カードクリック時の処理
    const handleCardClick = (index: number) => {
        alert(`Card ${index + 1} clicked! 🚀`);
    };

    return (
        <DefaultLayout>
            {/* 左上のロゴとテキスト */}
            <Box position="absolute" top="10px" left="10px">
                <Image src="../../img/funalab.png" alt="funalab logo" boxSize="100px" />
            </Box>

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
