import { useEffect, useRef, useState } from "react";
import { Button, Textarea } from "@mantine/core";
import SnetSDK from "snet-sdk-web";
import { example } from "./assets/summary_pb_service";
import styles from "./ExampleService.styles"

import { snetConfig } from "config/snet";
import { useAccount } from "wagmi";
import { serviceConfig } from "config/service";

interface Chat {
  type: "user" | "bot";
  message: string;
}



export default function ExampleService() {
  const defaultInput =
    'Analysts are predicting record highs as a global shortage of teddy bears sweeps the nation. "The market these products is way up". The advice is to stay indoors as society collapses under the demand.';
  const [logs, setLogs] = useState([]);
  const [userInput, setUserInput] = useState(defaultInput);
  const { connector, address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const logRef = useRef(null);


  const { classes, cx } = styles();

  const scrollToBottom = () => {
    if (logRef.current) {
      const scrollHeight = logRef.current.scrollHeight;
      logRef.current.scrollTo(0, scrollHeight);
    }
  };

  const newChat = (type: "user" | "bot", message: string) => {
    setChats((prevChats) => [...prevChats, { type, message }]);
  };

  const logToScreen = (...args) => {
    let method = "log";
    let message = "";

    args.forEach((arg) => {
      if (typeof arg === "string") {
        message += arg + " ";
      } else if (typeof arg === "object") {
        try {
          message += JSON.stringify(arg) + " ";
        } catch { }
      } else if (["log", "error", "warn", "info", "debug"].includes(arg)) {
        method = arg;
      }
    });
    if (message === "" || message === "{}") return;
    setLogs((prevLogs) => [...prevLogs, { method, message }]);
  };

  const runService = async () => {
    setLogs([]);
    setIsLoading(true);
    newChat("user", userInput);

    try {
      const provider = await connector.getProvider();
      const sdk = new SnetSDK({ ...snetConfig, web3Provider: provider });
      const client = await sdk.createServiceClient(serviceConfig.orgId, serviceConfig.serviceId);
      // const client = await sdk.createServiceClient("masp", "masp_s1");

      const request = new example.TextSummary.summary.requestType();
      request.setArticleContent(userInput);

      const invokeOptions = {
        request: request,
        debug: true,
        transport: undefined,
        onEnd: (response) => {
          setIsLoading(false);
          if (response.status === 0) {
            const value = response.message.getArticleSummary();
            newChat("bot", value.toString());
            console.log("--- Service Response ---", value.toString());
            return;
          }
          setIsLoading(false);
          console.error("error occured", response.status, response.message);
        },
      };



      await client.unary(example.TextSummary.summary, invokeOptions);
      // await client.unary(example.Calculator.add, invokeOptions);
    } catch (error) {
      // console.log("error", error);
      console.trace(error);
      console.error(error.message)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs])

  useEffect(() => {
    console.debug = console.log;
    // // Override console logging methods with custom logging wrapper
    ["log", "error", "warn", "info", "debug"].forEach((method) => {
      const originalConsoleMethod = console[method];
      console[method] = (...args) => {
        originalConsoleMethod(...args);
        logToScreen(...args);
      };
    });

    // Clean-up function to restore original console methods when the component unmounts
    return () => {
      ["log", "error", "warn", "info", "debug"].forEach((method) => {
        console[method] = console[method].__proto__;
      });
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
                <img src="/eth.png" alt="" /> Ethereum Mainnet
              </span>
            </div>
            <img className={classes.snetIcon} src="/snet-icon.png" alt="" />
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
            Summarize
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
