import { useEffect, useState } from "react";
import { Button, Space, Flex, Textarea } from "@mantine/core";
import SnetSDK from "snet-sdk-web";
import { example } from "../assets/summary_pb_service";
import { config } from "./config";
import { useAccount } from "wagmi";

export default function ExampleService() {
  const defaultInput = 'Analysts are predicting record highs as a global shortage of teddy bears sweeps the nation. "The market these products is way up". The advice is to stay indoors as society collapses under the demand.';
  const [logs, setLogs] = useState([]);
  const [userInput, setUserInput] = useState(defaultInput);
  const { connector, address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");

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
    setLogs((prevLogs) => [...prevLogs, { method, message }]);
  };

  const runService = async () => {
    setLogs([]);
    setIsLoading(true);
    setResult("");

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
    ['log', 'error', 'warn', 'info', 'debug'].forEach(method => {
        const originalConsoleMethod = console[method];
        console[method] = (...args) => {
            originalConsoleMethod(...args);
            logToScreen(...args)
        };
    });


    // Clean-up function to restore original console methods when the component unmounts
    return () => {
      ['log', 'error', 'warn', 'info', 'debug'].forEach(method => {
            console[method] = console[method].__proto__;
        });
    };
  }, []);

  return (
    <div>
      <p>
        Orgnization name: snet <br />
        Service name: news-summary <br />
        Network: Ethereum Mainnet
      </p>
      <div style={{ maxWidth: "400px" }}>
        <Textarea
          rows={4}
          autosize
          placeholder="Enter text"
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);
          }}
        />
      </div>
      <Space h="sm" />
      <Flex
        bg="rgba(0, 0, 0, .3)"
        gap="sm"
        justify="flex-start"
        align="flex-center"
        direction="row"
      >
        <Button
          loading={isLoading}
          disabled={!address}
          variant="filled"
          color="rgba(127, 27, 164, 1)"
          className="btn-primary"
          onClick={() => {
            runService();
          }}
        >
          Summarize
        </Button>
        <Button
          color="gray"
          onClick={() => {
            setLogs([]);
          }}
        >
          Clear Log
        </Button>
      </Flex>
      {result && (
        <p>
          <b>Result: {result}</b>
        </p>
      )}
      {logs.map((log, index) => (
        <p
          key={index}
          style={{
            color: log.method === "error" ? "red" : "#f1f1f1",
            margin: "3px",
          }}
        >
          <strong>{log.method.toUpperCase()}:</strong> {log.message}
        </p>
      ))}
    </div>
  );
}
