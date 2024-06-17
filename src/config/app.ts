const isDevMode = process.env.REACT_APP_ENV === 'production' ? false : true;
interface AppConfig {
    isDevMode: boolean;
    appName: string;
    alchemyApiKey: string;
    agixToken: string;
    walletConnectProjectId: string;
}

export const appConfig: AppConfig = {
    isDevMode,
    appName: 'SingularityNet',
    alchemyApiKey: process.env.REACT_APP_ALCHEMY_API_KEY || '',
    agixToken: process.env.REACT_APP_AGIX_TOKEN || '',
    walletConnectProjectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || ''
}