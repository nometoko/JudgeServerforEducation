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
import Submission from "./routes/Submission"

// import Dashboard from './routes/Dashboard';

const App: React.FC = () => {

  return (
    <ChakraProvider >

      <BrowserRouter>
        {/* <AxiosClientProvider> */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/submission/:problemId" element={<Submission />} />
          <Route path="/test" />
          <Route path="/" element={<Navigate to="/login" />} />
          {/* <Route path="/*" element={<NotFound />} /> */}


        </Routes>
        {/* </AxiosClientProvider> */}
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App;
