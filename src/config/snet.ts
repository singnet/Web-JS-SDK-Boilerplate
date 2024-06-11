const infuraProjectId = process.env.REACT_APP_INFURA_PROJECT_ID;
const networkId = process.env.REACT_APP_NETWORK === "sepolia" ? "11155111" : "1";
const rpcEndpoint = process.env.REACT_APP_NETWORK === "sepolia" ?
    `https://sepolia.infura.io/v3/${infuraProjectId}` :
    `https://mainnet.infura.io/v3/${infuraProjectId}`

interface SnetConfig {
    networkId: string;
    ipfsEndpoint: string;
    defaultGasPrice: string;
    defaultGasLimit: string;
    rpcEndpoint: string;
}

export const snetConfig: SnetConfig = {
    "networkId": networkId,
    "ipfsEndpoint": "https://ipfs.singularitynet.io",
    "defaultGasPrice": "8700000",
    "defaultGasLimit": "610000",
    "rpcEndpoint": rpcEndpoint,
}
