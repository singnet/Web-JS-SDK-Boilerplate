import { useEffect, useRef, useState } from "react";
import { Button, Textarea } from "@mantine/core";
import SnetSDK from "snet-sdk-web";
import { example } from "./assets/summary_pb_service";
import styles from "./ExampleService.styles";
import { snetConfig } from "config/snet";
import { useAccount } from "wagmi";
import { serviceConfig } from "config/service";
import ethLogo from "resources/assets/images/eth.png"
import snetIcon from "resources/assets/images/snet-icon.png"

interface Chat {
  type: "user" | "bot";
  message: string;
}

interface LogEntry {
  method: "log" | "error" | "warn" | "info" | "debug";
  message: string;
}

export const ExampleService: React.FC = () => {
  const defaultInput = 'Analysts are predicting record highs as a global shortage of teddy bears sweeps the nation. "The market these products is way up". The advice is to stay indoors as society collapses under the demand.';
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [userInput, setUserInput] = useState<string>(defaultInput);
  const { connector, address } = useAccount();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [clientSDK, setClientSDK] = useState<any | null>(null);
  const [servicePrice, setServicePrice] = useState<number | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const { classes, cx } = styles();

  const scrollToBottom = () => {
    if (logRef.current) {
      logRef.current.scrollTo(0, logRef.current.scrollHeight);
    }
  };

  const newChat = (type: "user" | "bot", message: string) => {
    setChats((prevChats) => [...prevChats, { type, message }]);
  };

  const logToScreen = (method: LogEntry['method'], message: string) => {
    if (message) {
      setLogs((prevLogs) => [...prevLogs, { method, message }]);
    }
  };

  function convertTokenAmount(rawAmount: number, decimals: number): number {
    return rawAmount / Math.pow(10, decimals);
  }

  const runService = async () => {
    setLogs([]);
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
        const provider = await connector.getProvider();
        const sdk = new SnetSDK({ ...snetConfig, web3Provider: provider });
        const client = await sdk.createServiceClient(serviceConfig.orgId, serviceConfig.serviceId);
        setClientSDK(client);
        const price = client._group.pricing.find((pricingItem: any) => pricingItem.default).price_in_cogs;
        const priceInTokens = convertTokenAmount(price, 8);
        setServicePrice(priceInTokens);
        setIsLoading(false);
      }
    }
    getClient();
  }, [connector]);

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  useEffect(() => {
    const originalConsole = { ...console };
    ["log", "error", "warn", "info", "debug"].forEach((method) => {
      (console as any)[method] = (...args: unknown[]) => {
        (originalConsole as any)[method](...args);
        logToScreen(method as LogEntry['method'], args.join(' '));
      };
    });

    return () => {
      ["log", "error", "warn", "info", "debug"].forEach((method) => {
        (console as any)[method] = (originalConsole as any)[method];
      })
    };
  }, []);

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
            disabled={!address}
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
      <div className={classes.logsWrapper}>
        {logs.length > 0 && (
          <Button
            variant="filled"
            className={cx("btn-secondary", classes.clearLog)}
            onClick={() => {
              setLogs([]);
            }}
          >
            Clear Log
          </Button>
        )}

        <div className={classes.logs} ref={logRef}>
          {logs.map((log, index) => {
            if (log.message === "{}" || log.message === "") return <></>;
            return (
              <p
                key={index}
                style={{
                  color: log.method === "error" ? "red" : "#f1f1f1",
                  margin: "3px",
                }}
              >
                <strong>{log.method.toUpperCase()}:</strong> {log.message}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ExampleService