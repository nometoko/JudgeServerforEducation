import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
//import { Myaxios_provider } from './providers/axios_client';

ReactDOM.createRoot(document.getElementById('root')!).render(
  < ChakraProvider  >
      <App />
  </ChakraProvider >
);
