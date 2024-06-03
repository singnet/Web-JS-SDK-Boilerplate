interface AppConfig {
    appName: string;
    alchemyApiKey: string;
    agixToken: string;
}

export const appConfig: AppConfig = {
    appName: 'SingularityNet',
    alchemyApiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    agixToken: process.env.REACT_APP_AGIX_TOKEN
}