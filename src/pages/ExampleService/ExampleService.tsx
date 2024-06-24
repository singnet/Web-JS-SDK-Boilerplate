import { useState } from "react";
import { Textarea } from "@mantine/core";
import DebugConsole from "components/Dev/DebugConsole/DebugConsole";
import { example } from "./assets/mainnet/summary_pb_service";
import styles from "./ExampleService.styles";
import { useAccount } from "wagmi";
import ethLogo from "resources/assets/images/eth.png"
import snetIcon from "resources/assets/images/snet-icon.png"
import { appConfig } from "config/app";
import { useSdk } from "providers/ServiceMetadataProvider";
import { ActionButton } from "components/UI/ActionButton";
import { serviceConfig } from "config/service";

interface Chat {
  type: "user" | "bot";
  message: string;
}

export const ExampleService: React.FC = () => {
  const defaultInput = 'Analysts are predicting record highs as a global shortage of teddy bears sweeps the nation. "The market these products is way up". The advice is to stay indoors as society collapses under the demand.';
  const { connector } = useAccount();
  const { clientSDK, setIsLoading } = useSdk();
  const [chats, setChats] = useState<Chat[]>([]);
  const [userInput, setUserInput] = useState<string>(defaultInput);

  const { classes, cx } = styles();

  const newChat = (type: "user" | "bot", message: string) => {
    setChats((prevChats) => [...prevChats, { type, message }]);
  };

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
        },
      };

      await clientSDK.unary(example.TextSummary.summary, invokeOptions);
    } catch (error) {
      console.error("Error executing service:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.serviceCallWrapper}>
        <div>
          <div className={classes.serviceCardWrapper}>
            <div className={classes.serviceCard}>
              <span className={classes.orgName}>Organization name: {serviceConfig.orgId}</span>
              Service name: {serviceConfig.serviceId} <br />
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
          <ActionButton
            onClick={() => {
              runService();
            }}
          >
            Summarize
          </ActionButton>
        </div>
      </div>
      {appConfig.isDevMode && <DebugConsole />}
    </div>
  );
}

export default ExampleService