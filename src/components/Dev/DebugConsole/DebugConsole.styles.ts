import { createStyles } from "@mantine/core";

export default createStyles((theme, _params) => {
    return {
        logsWrapper: {
            height: "100%",
            overflow: "hidden",
            paddingTop: "3rem",
            position: "relative",
            borderRadius: "10px",
            background: "rgba(22, 22, 24, 0.60)",
            maxWidth: "400px"
        },
        logs: {
            height: "100%",
            overflowY: "auto",
            marginTop: "1.5rem",
            padding: "1rem",
            scrollBehavior: 'smooth'
        },
        clearLog: {
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            padding: "1rem 3rem !important",
            marginTop: "0 !important",
        },
    };
});