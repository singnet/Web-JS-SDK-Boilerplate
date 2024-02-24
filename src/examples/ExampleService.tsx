import { useEffect, useState } from "react";
import { TextInput, Button, Space, Flex } from "@mantine/core";
import SnetSDK from "snet-sdk-web";
import { example } from "../assets/example_pb_service";
import { config } from "./config";
import { useAccount } from "wagmi";

export default function ExampleService() {
  const [logs, setLogs] = useState([]);
  const [firstNumber, setFirstNumber] = useState(10);
  const [secondNumber, setSecondNumber] = useState(20);
  const {connector, address} = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

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
    

    if(message.includes("LOG: ")) {
        setLogs((prevLogs) => [...prevLogs, { method, message }]);
    }
  };


  const runService = async () => {
    setLogs([]);
    setIsLoading(true);
    setResult('');
    const provider = await connector.getProvider();
    const sdk = new SnetSDK({ ...config, web3Provider: provider });

    const client = await sdk.createServiceClient("masp", "masp_s1");

    const request = new example.Calculator.add.requestType();
    request.setA(firstNumber);
    request.setB(secondNumber);

    const invokeOptions = {
      request: request,
      debug: true,
      transport: undefined,
      onEnd: (response) => {
        setIsLoading(false);
        if (response.status === 0) {
          const value = response.message.getValue();
          setResult(value);
          console.log("--- Service Response ---", value.toString());
          return;
        }
        console.error("error occured", response.status, response.message);
      },
    };

    await client.unary(example.Calculator.add, invokeOptions);
  };

  useEffect(() => {
    // Override console logging methods with custom logging wrapper
    ['log', 'error', 'warn', 'info', 'debug'].forEach(method => {
        const originalConsoleMethod = console[method];
        console[method] = (...args) => {
            originalConsoleMethod.apply(console, args);
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
        Orgnization name: masp <br />
        Service name: masp_s1 <br />
        Network: Goerli
      </p>
      <div style={{maxWidth: '245px'}}>
        <TextInput
            type="text"
            placeholder="Enter first number"
            value={firstNumber}
            onChange={(e) => {
            setFirstNumber(+e.target.value);
            }}
        />
        <Space h="sm" />
        <TextInput
            type="text"
            placeholder="Enter second number"
            value={secondNumber}
            onChange={(e) => {
            setSecondNumber(+e.target.value);
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
          {" "}
          Add Numbers{" "}
        </Button>
        <Button
          color="gray"
          onClick={() => {
            setLogs([]);
          }}
        >
          {" "}
          Clear Log{" "}
        </Button>
      </Flex>
      {
        result && <p><b>Result: {result}</b></p>
      }
      {logs.map((log, index) => (
        <p
          key={index}
          style={{ color: log.method === "error" ? "red" : "#f1f1f1", margin: '3px' }}
        >
          <strong>{log.method.toUpperCase()}:</strong> {log.message}
        </p>
      ))}
    </div>
  );
}
