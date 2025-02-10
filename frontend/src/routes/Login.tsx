import { useState, FormEvent, FC } from 'react';
import { HttpStatusCode } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Flex,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react";
//import { AxiosClientProvider } from "./providers/axios_client";
import myaxios from  "../providers/axios_client";
import { Myaxios_provider } from '../providers/axios_client';

export interface MyJwtPayload {
    exp: number,
    orig_iat: number,
    joined: Date,
    user: string,
  }

const Login = ({message}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    // 前の情報を削除
    //localStorage.removeItem("authUserName");
    //localStorage.removeItem("authJoinedDate");
    //localStorage.removeItem("authUserExp");

    const handle_login = (event: FormEvent) => {
        event.preventDefault();
        console.log("フォーム送信時の入力値:", { username, password });
    
        myaxios.post("/login", {
          username: username,
          password: password,
        })
          .then((response) => {
            if (response.status === HttpStatusCode.Ok) { // 200
              const jwtToken = jwtDecode<MyJwtPayload>(response.data.access_token);
              localStorage.setItem("authUserName", jwtToken.user);
//              localStorage.setItem("authJoinedDate", jwtToken.joined.toString());
              localStorage.setItem("authUserExp", jwtToken.exp.toString());
              if (location.state) { // ログイン画面に遷移する前のページが存在する場合
                navigate(location.state, { replace: true }) // ブラウザの履歴が置き換えられ、戻るボタンで前の状態に戻らないようにしています。
              } else {
                // console.log("token", response.data.access_token);　一致を確認、これはログイン時に生成されるトークン
                navigate('/dashboard', { replace: true })
              }
            } else {
              console.error(response.statusText);
              setError('ログイン情報が間違っています。');
            }
          })
          .catch((error) => {
            if (error.response?.status === HttpStatusCode.Unauthorized) {
              console.error(error);
              setError('ログイン情報が間違っています。');
            } else {
              console.error(error);
              setError('通信に失敗しました。');
            }
          });
      };

    //const handleLogin = () => {
    //    if (username === "user" && password === "password") {
    //        alert("ログイン成功！🎉");
    //    } else {
    //        setError("ユーザー名またはパスワードが違います。");
    //    }
    //};

    return (
        <Flex w="100vw" h="100vh" align="center" justify="center">
            <Container maxW="lg" py="12" px="6" bg="white" boxShadow="md" borderRadius="md">
                <Box p="8" borderWidth="1px" borderRadius="lg" boxShadow="lg" bg="white">
                    <form onSubmit={handle_login}>
                        <VStack spacing="6">
                            <Heading size="lg" textAlign="center">
                                ログイン
                            </Heading>

                            {/* メッセージ表示 */}
                            {message && <Text color="blue.500">{message}</Text>}

                            <FormControl>
                                <FormLabel>UserName</FormLabel>
                                <Input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </FormControl>

                            {error && <Text color="red.500">{error}</Text>}

                            {/* ボタンの type を "submit" にする */}
                            <Button
                                type="submit"
                                bg="#81E6D9"
                                width="full"
                                shadow="md"
                                _hover={{ bg: "#38B2AC" }}
                            >
                                ログイン
                            </Button>
                        </VStack>
                    </form>
                </Box>
            </Container>
        </Flex>
    );
};

export default Login;
