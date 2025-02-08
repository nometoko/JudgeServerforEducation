import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AxiosClientProvider } from "./providers/AxiosClientProvider";
// import { RouteAuthGuard } from "./providers/RouteAuthGuard";
// import { PageType } from "./types/PageTypes";
import {
  ChakraProvider,
  extendTheme

} from '@chakra-ui/react';
import Login from "./routes/Login";

import DashboardPage from "./routes/Dashboard";
import Problem from './routes/Problem';
import Account from './routes/Account';
import NotFound from './routes/NotFound';


// import Dashboard from './routes/Dashboard';

const App: React.FC = () => {

  return (
    <ChakraProvider >

      <BrowserRouter>
        {/* <AxiosClientProvider> */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/problem/:problemId" element={<Problem />} />
          <Route path="/test" />
          <Route path="/account" element={<Account />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/*" element={<NotFound />} />


        </Routes>
        {/* </AxiosClientProvider> */}
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App;
