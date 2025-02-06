// debug用に適宜書き換えています

import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

//const API_BASE_URL = `http://${process.env.REACT_APP_PUBLIC_SERVER_IP}:${process.env.REACT_APP_BACKEND_PORT}`;
const API_BASE_URL = `http://${import.meta.env.VITE_PUBLIC_SERVER_IP}:${import.meta.env.VITE_BACKEND_PORT}`;

console.log("API_BASE_URL:", API_BASE_URL);

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

  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`${API_BASE_URL}/getProblemList`)
    .then((response) => {
      setMessage(response.data.message)
      console.log("response:", response)
    })    
    .catch(() => setMessage("Error fetching data"));
  }, []);

  //useEffect(() => {
  //  fetch(`${API_BASE_URL}`)
  //    .then((res) => res.json())
  //    .then((data) => setMessage(data.message))
  //    .catch(() => setMessage("Error fetching data"));
  //}, []);

  console.log("message:", message);

  return (
    <ChakraProvider theme={theme}>

      <BrowserRouter>
        {/* <AxiosClientProvider> */}
        <Routes>
          <Route path="/login" element={<Login message={message} />} />
          {/* <Route path="/dashboard" element={} /> */}
          <Route path="/" element={<Navigate to="/login" />} />
          {/* <Route path="/*" element={<NotFound />} /> */}

        </Routes>
        {/* </AxiosClientProvider> */}
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
