import React from "react";
import {
  WagmiConfig,
  configureChains,
  createConfig,
} from "wagmi";
import { infuraProvider } from 'wagmi/providers/infura'
import { polygonMumbai, goerli } from 'wagmi/chains'
import { connectorsForWallets, getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { 
  googleWallet,
} from '@zerodev/wagmi/rainbowkit'
export const projectId = 'b5486fa4-e3d9-450b-8428-646e757c10f6'

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai, goerli],
  [infuraProvider({apiKey: '0da90e9815124645bb280ed7e5edcf3e'})]
)
//f36f7f706a58477884ce6fe89165666c
const googleWalletConnectorFunction = connectorsForWallets([
  {
    groupName: 'Social',
      wallets: [
        googleWallet({chains, options: { projectId}})
    ],
  },
]);

// Getting the connectors function from getDefaultWallets
const defaultConnectorsFunction = getDefaultWallets({
  appName: 'Singularity',
  projectId: '286adf4c7723d24f7380ff97351cb406',
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

function ZeroDevWrapper({children}: {children: React.ReactNode}) {
  return (
    <WagmiConfig config={config}>
    <RainbowKitProvider theme={darkTheme({
    accentColor: '#7F1BA4',
    accentColorForeground: 'white'})} chains={chains} modalSize="compact">
      {children}
    </RainbowKitProvider>
  </WagmiConfig>
  )
}

export default ZeroDevWrapper