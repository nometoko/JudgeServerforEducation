import { FormEvent } from 'react';
import { HttpStatusCode } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Flex,
  VStack,
  Text,
  Image,
} from "@chakra-ui/react";
//import { AxiosClientProvider } from "./providers/axios_client";
import myaxios from "../providers/axios_client";

export interface MyJwtPayload {
  exp: number,
  orig_iat: number,
  joined_date: string,
  user: string,
}

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // パスワード入力欄への参照を定義
  const passwordRef = useRef<HTMLInputElement>(null);

  // 前の情報を削除
  //localStorage.removeItem("authUserName");
  //localStorage.removeItem("authJoinedDate");
  //localStorage.removeItem("authUserExp");

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();
    console.log("フォーム送信時の入力値:", { username, password });

    myaxios.post("/login", {
      username: username,
      password: password,
    })
      .then((response) => {

        if (response.status === HttpStatusCode.Ok) {
          if (location.state) {
            //console.log("here", location.state);
            navigate(location.state, { replace: true });
          } else {
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


  /** 🔹 Enterキーを押したらパスワード入力欄にフォーカス */
  /** 🔹 Enterキーを押したらパスワード入力欄にフォーカス */
  const handleKeyDownUserName = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // フォーム送信を防ぐ
      passwordRef.current?.focus(); // パスワード入力欄にフォーカスを移動
    }
  };

  /** 🔹 Enterキーを押したらログインボタンを押す */
  const handleKeyDownPassword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // フォーム送信を防ぐ
      if (username.trim() && password.trim()) {
        handleLogin(e); // イベントオブジェクトを渡す
      }
    }
  };




  return (
    <Flex h="100vh" align="center" justify="center">
      {/* 左上のロゴ */}
      <Box position="absolute" top="10px" left="10px">
        <Image src="/photos/funalab.png" alt="funalab logo" boxSize="100px" />
      </Box>

      <Container
        maxW="xl"
        py={{ base: "10", lg: "12" }}
        px={{ base: "0", lg: "10" }}
        bg="white"
        boxShadow="md"
        borderRadius="md"
      >
        <Box p="20" borderWidth="1px" borderRadius="lg" boxShadow="md" bg="white">
          {/* form タグで囲むことで Enter キーでの送信も有効に */}
          <form onSubmit={handleLogin}>
            <VStack spacing="6">
              <Heading size="lg" textAlign="center">
                Login
              </Heading>

              <FormControl>
                <FormLabel>UserName</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDownUserName} // Enterでパスワード欄へ
                />
              </FormControl>

              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDownPassword} // Enterで送信
                  ref={passwordRef}
                />
              </FormControl>

              {error && <Text color="red.500">{error}</Text>}

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
