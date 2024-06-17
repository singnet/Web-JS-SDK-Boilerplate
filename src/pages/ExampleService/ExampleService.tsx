import { useEffect, useState } from "react";
import { Button, Textarea } from "@mantine/core";
import DebugConsole from "components/Dev/DebugConsole/DebugConsole";
import SnetSDK from "snet-sdk-web";
import { example } from "./assets/summary_pb_service";
import styles from "./ExampleService.styles";
import { snetConfig } from "config/snet";
import { useAccount } from "wagmi";
import { serviceConfig } from "config/service";
import ethLogo from "resources/assets/images/eth.png"
import snetIcon from "resources/assets/images/snet-icon.png"
import { prepareWriteContract, fetchFeeData } from '@wagmi/core'
import { toast } from 'react-toastify';
import { appConfig } from "config/app";
import { erc20ABI } from 'wagmi'


interface Chat {
  type: "user" | "bot";
  message: string;
}

export const ExampleService: React.FC = () => {
  const defaultInput = 'Analysts are predicting record highs as a global shortage of teddy bears sweeps the nation. "The market these products is way up". The advice is to stay indoors as society collapses under the demand.';
  const [userInput, setUserInput] = useState<string>(defaultInput);
  const { connector, address } = useAccount();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [clientSDK, setClientSDK] = useState<any | null>(null);
  const [servicePrice, setServicePrice] = useState<number | null>(null);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

  const { classes, cx } = styles();

  const newChat = (type: "user" | "bot", message: string) => {
    setChats((prevChats) => [...prevChats, { type, message }]);
  };

  function convertTokenAmount(rawAmount: number, decimals: number): number {
    return rawAmount / Math.pow(10, decimals);
  }

  const runService = async () => {
    setIsLoading(true);
    newChat("user", userInput);

    try {
      if (!connector) return;
      const request = new example.TextSummary.summary.requestType();
      request.setArticleContent(userInput);

      const invokeOptions = {
        request: request,
        debug: true,
        transport: undefined,
        onEnd: (response: any) => {
          setIsLoading(false);
          if (response.status === 0) {
            const value = response.message.getArticleSummary();
            newChat("bot", value.toString());
            console.log("--- Service Response ---", value.toString());
            return;
          }
          console.error("error occurred", response.status, response.message);
          setIsLoading(false);
        },
      };

      await clientSDK.unary(example.TextSummary.summary, invokeOptions);
    } catch (error) {
      console.error("Error executing service:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getClient = async () => {
      if (connector) {
        setIsLoading(true);
        let priceInWei = null;
        try {
          try {
            const provider = await connector.getProvider();
            const sdk = new SnetSDK({ ...snetConfig, web3Provider: provider });
            const client = await sdk.createServiceClient(serviceConfig.orgId, serviceConfig.serviceId);
            setClientSDK(client);
            const price = client._group.pricing.find((pricingItem: any) => pricingItem.default).price_in_cogs;
            const priceInTokens = convertTokenAmount(price, 8);
            priceInWei = BigInt(price * 10);
            setServicePrice(priceInTokens);
          } catch (error) {
            throw new Error('Error getting service metadata');
          }
          try {
            const feeData = await fetchFeeData()
            if (feeData.gasPrice) {
              await prepareWriteContract({
                address: appConfig.agixToken as `0x${string}`,
                abi: erc20ABI,
                gas: 50000n,
                gasPrice: feeData.gasPrice,
                functionName: 'approve',
                args: [address as `0x${string}`, priceInWei]
              })
              setButtonDisabled(false);
            }
          } catch (error) {
            throw new Error('Error getting transaction fee');
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
    <div className={classes.container}>
      <div className={classes.serviceCallWrapper}>
        <div>
          <div className={classes.serviceCardWrapper}>
            <div className={classes.serviceCard}>
              <span className={classes.orgName}>Organization name: snet</span>
              Service name: news-summary <br />
              <span className={classes.network}>
                <img src={ethLogo} alt="" /> Ethereum Mainnet
              </span>
            </div>
            <img className={classes.snetIcon} src={snetIcon} alt="" />
          </div>

        </div>
        <div className={classes.responses}>
          {chats.map((chat, index) => (
            <p
              key={index}
              className={cx(classes.chatItem, {
                [classes.chatItemUser]: chat.type === "user",
              })}
            >
              {chat.message}
            </p>
          ))}
        </div>
        <div className={classes.userInputWrapper}>
          <Textarea
            className={classes.userInput}
            rows={4}
            autosize={false}
            placeholder="Enter text"
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
            }}
          />
          <Button
            loading={isLoading}
            disabled={buttonDisabled}
            variant="filled"
            color="rgba(127, 27, 164, 1)"
            className="btn-primary btn-medium"
            onClick={() => {
              runService();
            }}
          >
            Summarize {servicePrice && `(${servicePrice} AGIX)`}
          </Button>
        </div>
      </div>
      {appConfig.isDevMode && <DebugConsole />}
    </div>
  );
}

export default ExampleService