import { useEffect, useState } from "react";
import { Button, Space, Flex, Textarea, createStyles } from "@mantine/core";
import SnetSDK from "snet-sdk-web";
import { example } from "../assets/summary_pb_service";
import { config } from "./config";
import { useAccount } from "wagmi";

interface Chat {
  type: "user" | "bot";
  message: string;
}

const useStyles = createStyles((theme, _params) => {
  return {
    container: {
      display: "grid",
      gridTemplateColumns: "1fr 400px",
      gap: "1rem",
      height: "calc(100vh - 6rem)",
    },
    serviceCallWrapper: {
      height: "100%",
      display: "grid",
      gap: "1.5rem",
      gridTemplateRows: "120px auto 130px",
    },
    serviceCardWrapper: {
      borderRadius: "var(--border-radius)",
      background: "var(--color-gray)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "1rem 1.5rem",
    },
    serviceCard: {
      display: "flex",
      flexDirection: "column",
      gap: "0.3rem",
    },
    orgName: {
      fontSize: "1.3rem",
      display: "flex",
    },
    chatItem: {
      borderLft: "1px solid transparent",
      paddingLeft: "0.5rem",
    },
    chatItemUser: {
      opacity: 0.8,
      borderLeft: "1px solid #6F6F6F",
    },
    network: {
      display: "flex",
      alignItems: "center",
      gap: "0.7rem",
      fontWeight: 500,
      fontSize: "0.9rem",
      marginTop: "0.5rem",
      img: {
        width: "1.5rem",
      },
    },
    snetIcon: {
      width: 80,
    },
    responses: {
      height: "calc(100vh - 400px)",
      overflowY: "auto",
    },
    logsWrapper: {
      height: "100%",
      overflow: "hidden",
      paddingTop: "3rem",
      position: "relative",
      borderRadius: "10px",
      background: "rgba(22, 22, 24, 0.60)",
    },
    logs: {
      height: "100%",
      overflowY: "auto",
      marginTop: "1.5rem",
      padding: "1rem",
    },
    clearLog: {
      position: "absolute",
      top: "0.5rem",
      right: "0.5rem",
      padding: "1rem 3rem !important",
      marginTop: "0 !important",
    },
    userInputWrapper: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      alignItems: "flex-end",
    },
    userInput: {
      width: "100%",
      textarea: {
        borderRadius: "10px",
        background: "var(--color-gray)",
        border: "1px solid rgba(255, 255, 255, 0.13)",
        backdropFilter: "blur(250px)",
        boxShadow: "none",
        "&:focus": {
          borderColor: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };
});

export default function ExampleService() {
  const defaultInput =
    'Analysts are predicting record highs as a global shortage of teddy bears sweeps the nation. "The market these products is way up". The advice is to stay indoors as society collapses under the demand.';
  const [logs, setLogs] = useState([]);
  const [userInput, setUserInput] = useState(defaultInput);
  const { connector, address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);

  const { classes, cx } = useStyles();

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
        } catch {}
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
      const sdk = new SnetSDK({ ...config, web3Provider: provider });
      const client = await sdk.createServiceClient("snet", "news-summary");

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
            setResult(value);
            newChat("bot", value.toString());
            console.log("--- Service Response ---", value.toString());
            return;
          }
          console.error("error occured", response.status, response.message);
        },
      };

      

      await client.unary(example.TextSummary.summary, invokeOptions);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Override console logging methods with custom logging wrapper
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

        <div className={classes.logs}>
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
