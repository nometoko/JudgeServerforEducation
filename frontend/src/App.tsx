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
  //  .then((response) => {
  //    setMessage(response.data.message)
  //    console.log("response:", response)
  //  })    
  //  .catch(() => setMessage("Error fetching data"));
  //}, []);

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
