import { useNavigate } from "react-router-dom";
import {
    Text,
} from "@chakra-ui/react";
import DefaultLayout from "@/components/DefaultLayout";

const NotFound = () => {
    return (
        <DefaultLayout>
            <Text>
                NotFound
            </Text>
        </DefaultLayout>
    )
}
export default NotFound;
