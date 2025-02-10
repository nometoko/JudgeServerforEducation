import { Container } from "@chakra-ui/react";
import { DefaultLayout } from "../components/DefaultLayout";
import { CardList } from "../components/CardList";
import { dummyProblems } from "./TestProblems"; // ✅ `data.ts` からインポート

const DashboardPage = () => {
    return (
        <DefaultLayout>
            <Container maxW="xl" p={6}>
                <CardList data={dummyProblems} />
            </Container>
        </DefaultLayout>
    );
};

export default DashboardPage;
