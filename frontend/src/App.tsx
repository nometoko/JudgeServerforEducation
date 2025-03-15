// debug用に適宜書き換えています

import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { AuthGuard } from "@/providers/AuthGuard";
import { PageType } from "@/types/PageType";
import { AuthProvider } from "./providers/AuthContext";

// import Dashboard from './routes/Dashboard';

import Submission from './routes/Submission';
import { RootAuthGuard } from './providers/RootAuthGuard';

const App: React.FC = () => {
  return (
    <ChakraProvider >
      <BrowserRouter basename='/top'>
        <AuthProvider>
          {/* <AxiosClientProvider> */}
          <Myaxios_provider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<AuthGuard component={<DashboardPage />} pageType={PageType.Public} />} />
                <Route path="/problem/:problemId" element={<AuthGuard component={<Problem />} pageType={PageType.Public} />} />
                <Route path="/submission/:submissionId" element={<AuthGuard component={<Submission />} pageType={PageType.Public} />} />
                <Route path="/results" element={<AuthGuard component={<Results />} pageType={PageType.Public} />} />
                <Route path="/b3status" element={<AuthGuard component={<B3Status />} pageType={PageType.Private} />} />
                <Route path="/account" element={<AuthGuard component={<Account />} pageType={PageType.Public} />} />
                <Route path="/tools" element={<AuthGuard component={<Tools />} pageType={PageType.Public} />} />
                <Route path="/LabMembers" element={<AuthGuard component={<LabMembers />} pageType={PageType.Public} />} />

                <Route path="/account" element={<AuthGuard component={<Account />} pageType={PageType.Public} />} />
                <Route path="/" element={<RootAuthGuard component1={<Navigate to="/dashboard" />} component2={<Navigate to="/login" />} />} />
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
