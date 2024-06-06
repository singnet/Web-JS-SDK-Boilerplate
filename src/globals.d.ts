interface Window {
    ethereum?: any; // Make ethereum property optional
}

declare module 'snet-sdk-web' {
    var SnetSDK: any;
    export default SnetSDK;
}

declare module '*.mp4' {
    const src: string;
    export default src;
}