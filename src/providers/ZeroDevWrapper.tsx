import React from "react";
import {
  WagmiConfig,
  configureChains,
  createConfig,
} from "wagmi";
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { mainnet, sepolia } from 'wagmi/chains'
import { connectorsForWallets, getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { particleWallet } from '@particle-network/rainbowkit-ext';
import { ParticleNetwork } from '@particle-network/auth';
import { appConfig } from "../config/app";

new ParticleNetwork({
  projectId: process.env.REACT_APP_PARTICLE_AUTH_PROJECT_ID as string,
  clientKey: process.env.REACT_APP_PARTICLE_AUTH_CLIENT_KEY as string,
  appId: process.env.REACT_APP_PARTICLE_AUTH_APP_ID as string,
});


export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, sepolia],
  [alchemyProvider({ apiKey: appConfig.alchemyApiKey }),]
)

const particleWallets = [
  particleWallet({ chains, authType: 'google' }),
  particleWallet({ chains, authType: 'facebook' }),
  particleWallet({ chains, authType: 'apple' }),
  particleWallet({ chains }),
];

//f36f7f706a58477884ce6fe89165666c
const googleWalletConnectorFunction = connectorsForWallets([
  {
    groupName: 'Social',
    wallets: [
      ...particleWallets
    ],
  },
]);

// Getting the connectors function from getDefaultWallets
const defaultConnectorsFunction = getDefaultWallets({
  appName: 'Singularity',
  projectId: appConfig.walletConnectProjectId,
  chains
}).connectors;

const googleWalletConnector = googleWalletConnectorFunction();
const defaultConnectors = defaultConnectorsFunction();

// Merging Google Wallet connector with default connectors
const connectors = [
  ...defaultConnectors,
  ...googleWalletConnector
];

const config = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
  webSocketPublicClient
})

export interface ZeroDevWrapperProps {
  children: React.ReactNode;
}

const ZeroDevWrapper: React.FC<ZeroDevWrapperProps> = ({ children }) => {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider theme={
        darkTheme({
          accentColor: '#7F1BA4',
          accentColorForeground: 'white'
        })
      }
        chains={chains}
        modalSize="compact"
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default ZeroDevWrapper