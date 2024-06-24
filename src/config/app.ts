const isDevMode = process.env.REACT_APP_ENV === 'production' ? false : true;
const isTestnet = process.env.REACT_APP_NETWORK === "sepolia" ? true : false;
const agixTokenAddress = isTestnet ? "0xf703b9aB8931B6590CFc95183be4fEf278732016" :
    "0x5B7533812759B45C2B44C19e320ba2cD2681b542"

interface AppConfig {
    isDevMode: boolean;
    appName: string;
    alchemyApiKey: string;
    agixToken: string;
    walletConnectProjectId: string;
    isTestnet: boolean;
}

export const appConfig: AppConfig = {
    isDevMode,
    appName: 'SingularityNet',
    alchemyApiKey: process.env.REACT_APP_ALCHEMY_API_KEY || '',
    agixToken: agixTokenAddress || '',
    walletConnectProjectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || '',
    isTestnet: isTestnet
}