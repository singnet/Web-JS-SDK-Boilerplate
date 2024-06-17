import { useEffect, useRef, useState } from "react";
import { Button } from "@mantine/core";
import styles from "./DebugConsole.styles";

interface LogEntry {
  method: "log" | "error" | "warn" | "info" | "debug";
  message: string;
}

export const DebugConsole: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  const { classes, cx } = styles();

  const logToScreen = (method: LogEntry['method'], message: string) => {
    if (message) {
      setLogs((prevLogs) => [...prevLogs, { method, message }]);
    }
  };

  const scrollToBottom = () => {
    if (logRef.current) {
      logRef.current.scrollTo(0, logRef.current.scrollHeight);
    }
  };

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
  );
}

export default DebugConsole