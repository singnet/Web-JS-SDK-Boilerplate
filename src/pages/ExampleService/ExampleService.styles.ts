import { createStyles } from "@mantine/core";

export default createStyles((theme, _params) => {
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
            scrollBehavior: 'smooth'
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