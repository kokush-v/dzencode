import React, { StrictMode } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import AppContainer from './modules/app';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <AppContainer />
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>
);
