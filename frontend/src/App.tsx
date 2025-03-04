// debug用に適宜書き換えています

import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Component, useEffect, useState } from "react";
import axios from "axios";
import { Myaxios_provider } from './providers/axios_client';

//const API_BASE_URL = `http://${process.env.REACT_APP_PUBLIC_SERVER_IP}:${process.env.REACT_APP_BACKEND_PORT}`;
const API_BASE_URL = `http://${import.meta.env.VITE_PUBLIC_SERVER_IP}:${import.meta.env.VITE_BACKEND_PORT}`;

console.log("API_BASE_URL:", API_BASE_URL);

// import { AxiosClientProvider } from "./providers/AxiosClientProvider";
// import { RouteAuthGuard } from "./providers/RouteAuthGuard";
// import { PageType } from "./types/PageTypes";
import { ChakraProvider } from '@chakra-ui/react';
import Login from "./routes/Login";
import React from 'react';

import DashboardPage from "./routes/Dashboard";
import Problem from '@/routes/Problem';
import Account from '@/routes/Account';
import Results from '@/routes/Results';
import NotFound from '@/routes/NotFound';
import B3Status from '@/routes/B3Status';
import Tools from '@/routes/Tools';
import LabMembers from '@/routes/LabMembers'
import { AuthGuard } from "./providers/AuthGuard";
import { PageType } from "./types/PageType";
import { AuthProvider } from "./providers/AuthContext";

// import Dashboard from './routes/Dashboard';

import Submission from './routes/Submission';

const App: React.FC = () => {

  const [message, setMessage] = useState("");

  //useEffect(() => {
  //  axios.post(`${API_BASE_URL}/login`, {
  //    username: "test",
  //    password: "test"
  //  })
  //  .then((response) => {
  //    // レスポンスは { access_token, token_type } の形式になるはずです
  //    setMessage("ログイン成功！");
  //    console.log("Login response:", response.data);
  //  })
  //  .catch((error) => {
  //    setMessage("ログインエラー");
  //    console.error("Error during login:", error);
  //  });
  //}, []);

  //// axios を使って x-www-form-urlencoded 形式で送信する例
  //  axios.post(`${API_BASE_URL}/login`, qs.stringify({
  //    username: "test",
  //    password: "test"
  //  }), {
  //    headers: {
  //      "Content-Type": "application/x-www-form-urlencoded"
  //    }
  //  })
  //  .then((response) => {
  //    console.log("Login response:", response.data);
  //  })
  //  .catch((error) => {
  //    console.error("Error during login:", error);
  //  });


  //useEffect(() => {
  //  axios.get(`${API_BASE_URL}/tmp`)
  //    .then((response) => {
  //      setMessage(response.data.message)
  //      console.log("response:", response)
  //    })
  //    .catch(() => setMessage("Error fetching data"));
  //}, []);

  //useEffect(() => {
  //  fetch(`${API_BASE_URL}`)
  //    .then((res) => res.json())
  //    .then((data) => setMessage(data.message))
  //    .catch(() => setMessage("Error fetching data"));
  //}, []);

  return (
    <ChakraProvider >
      <BrowserRouter>
        <AuthProvider>
          {/* <AxiosClientProvider> */}
          <Myaxios_provider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<AuthGuard component={<DashboardPage />} pageType={PageType.Public} />} />
              <Route path="/problem/:problemId" element={<AuthGuard component={<Problem />} pageType={PageType.Public} />} />
              <Route path="/submission/:submissionId" element={<AuthGuard component={<Submission />} pageType={PageType.Public} />} />
              <Route path="/results" element={<AuthGuard component={<Results />} pageType={PageType.Public} />} />
              {/*<Route path="/b3status" element={<B3Status />} />*/}
              <Route path="/b3status" element={<AuthGuard component={<B3Status />} pageType={PageType.Private} />} />
              {/*<Route path="/submission/:submissionId" element={<RouteAuthGuard component={<SubmissionPage />} pageType={PageType.Public} />} />*/}
              <Route path="/test" />
              <Route path="/account" element={<Account />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/LabMembers" element={<LabMembers />} />

              <Route path="/account" element={<AuthGuard component={<Account />} pageType={PageType.Public} />} />
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/*" element={<NotFound />} />

            </Routes>
          </Myaxios_provider>
          {/* </AxiosClientProvider> */}
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
