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
// import Dashboard from './routes/Dashboard';

const theme = extendTheme({
  colors: {
    brand: {
      100: "#f7fafc",
      // ...
      900: "#1a202c",
    },
  },
})
const App: React.FC = () => {

  return (
    <ChakraProvider theme={theme}>

      <BrowserRouter>
        {/* <AxiosClientProvider> */}
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* <Route path="/dashboard" element={} /> */}
          <Route path="/" element={<Navigate to="/login" />} />
          {/* <Route path="/*" element={<NotFound />} /> */}

        </Routes>
        {/* </AxiosClientProvider> */}
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App;
