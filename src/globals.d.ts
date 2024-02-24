declare module 'snet-sdk-web' {
    const SnetSdkWeb: any;
    export default SnetSdkWeb;
}
interface Window {
    ethereum?: any; // Make ethereum property optional
}