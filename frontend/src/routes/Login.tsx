import { FormEvent, FC, useState, useRef } from 'react';
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
  VStack,
  Text,
  Image,
} from "@chakra-ui/react";
import myaxios from "../providers/axios_client";
import { useAuth } from "../providers/AuthContext";

export interface MyJwtPayload {
  exp: number,
  orig_iat: number,
  joined_date: string,
  user: string,
}

const Login: FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const passwordRef = useRef<HTMLInputElement>(null);

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();
    myaxios.post("/login", {
      username: username,
      password: password,
    })
      .then((response) => {
        if (response.status === HttpStatusCode.Ok) {
        //  const jwtToken = jwtDecode<MyJwtPayload>(response.data.access_token);
        //  localStorage.setItem("authUserName", jwtToken.user);
        //  localStorage.setItem("authJoinedDate", jwtToken.joined_date);
        //  localStorage.setItem("authUserExp", jwtToken.exp.toString());
        //  console.log("authUserName", authUserName);
          if (location.state) {
            //console.log("here", location.state);
            navigate(location.state, { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        } else {
          setError('ログイン情報が間違っています。');
        }
      })
      .catch((error) => {
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          setError('ログイン情報が間違っています。');
        } else {
          setError('通信に失敗しました。');
        }
      });
  };

  const handleKeyDownUserName = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      passwordRef.current?.focus();
    }
  };

  const handleKeyDownPassword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin(e as unknown as FormEvent);
    }
  };

  return (
    <Flex h="100vh" align="center" justify="center">
      <Box position="absolute" top="10px" left="10px">
        <Image src="../../img/funalab.png" alt="funalab logo" boxSize="100px" />
      </Box>

      <Container
        maxW="xl"
        py={{ base: "10", lg: "12" }}
        px={{ base: "0", lg: "10" }}
        bg="white"
        boxShadow="md"
        borderRadius="md"
      >
        {/* 内側の Box は必要に応じて使用、ここではスタイルを最小限にしています */}
        <Box p="20" bg="white">
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
                  onKeyDown={handleKeyDownUserName}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDownPassword}
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
