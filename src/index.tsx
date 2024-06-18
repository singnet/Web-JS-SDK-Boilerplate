import '@rainbow-me/rainbowkit/styles.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MantineProvider } from '@mantine/core';
import ZeroDevWrapper from 'providers/ZeroDevWrapper';
import { NotificationsProvider } from '@mantine/notifications';
import { ToastContainer } from 'react-toastify';
import "styles/global.css";
import 'react-toastify/dist/ReactToastify.css';
import { SdkProvider } from 'providers/ServiceMetadataProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
      <ToastContainer theme="dark" />
      <NotificationsProvider>
        <ZeroDevWrapper>
          <SdkProvider>
            <App />
          </SdkProvider>
        </ZeroDevWrapper>
      </NotificationsProvider>
    </MantineProvider>
  </React.StrictMode>
);