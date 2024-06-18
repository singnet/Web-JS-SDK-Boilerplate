import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import SnetSDK from "snet-sdk-web";
import { toast } from 'react-toastify';
import { prepareWriteContract, fetchFeeData } from '@wagmi/core'
import { serviceConfig } from "config/service";
import { erc20ABI, useAccount } from 'wagmi'
import { snetConfig } from "config/snet";
import { appConfig } from 'config/app';

interface AuthContextType {
    clientSDK: any;
    servicePrice: number | null;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void
}

const SdkContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const SdkProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const { connector, address } = useAccount();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [clientSDK, setClientSDK] = useState<any | null>(null);
    const [servicePrice, setServicePrice] = useState<number | null>(null);

    function convertTokenAmount(rawAmount: number, decimals: number): number {
        return rawAmount / Math.pow(10, decimals);
    }

    useEffect(() => {
        async function getClient() {
            if (connector) {
                setIsLoading(true);
                let priceInWei = null;
                try {
                    const provider = await connector.getProvider();
                    const sdk = new SnetSDK({ ...snetConfig, web3Provider: provider });
                    const client = await sdk.createServiceClient(serviceConfig.orgId, serviceConfig.serviceId);
                    setClientSDK(client);
                    const price = client._group.pricing.find((pricingItem: any) => pricingItem.default).price_in_cogs;
                    const priceInTokens = convertTokenAmount(price, 8);
                    priceInWei = BigInt(price * 10);
                    setServicePrice(priceInTokens);

                    const feeData = await fetchFeeData();
                    if (feeData.gasPrice) {
                        await prepareWriteContract({
                            address: appConfig.agixToken as `0x${string}`,
                            abi: erc20ABI,
                            gas: 50000n,
                            gasPrice: feeData.gasPrice,
                            functionName: 'approve',
                            args: [address as `0x${string}`, priceInWei]
                        });
                    }
                } catch (error) {
                    console.log(error);
                    toast.error(String(error));
                } finally {
                    setIsLoading(false);
                }
            }
        }

        getClient();
    }, [connector, address]);

    return (
        <SdkContext.Provider value={{ clientSDK, servicePrice, isLoading, setIsLoading }}>
            {children}
        </SdkContext.Provider>
    )
};

export const useSdk = () => {
    const context = useContext(SdkContext);
    if (!context) {
        throw new Error('useSdk must be used within an SdkProvider');
    }
    return context;
};
