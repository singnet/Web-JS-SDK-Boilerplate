import { appConfig } from "./app";

interface ServiceConfig {
    orgId: string;
    serviceId: string;
}

const mainnetServiceConfig: ServiceConfig = {
    orgId: "snet",
    serviceId: "news-summary"
};

const testnetServiceConfig: ServiceConfig = {
    orgId: "Naint1",
    serviceId: "ServNaint7"
};

export const serviceConfig = appConfig.isTestnet ? testnetServiceConfig : mainnetServiceConfig;