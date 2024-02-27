export const config = {
    "web3Provider": (window as any)?.web3?.currentProvider || undefined,
    "networkId": "1",
    "ipfsEndpoint": "https://ipfs.singularitynet.io",
    "defaultGasPrice": "4700000",
    "defaultGasLimit": "210000",
}