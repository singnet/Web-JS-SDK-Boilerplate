import { createStyles } from "@mantine/core";

export default createStyles((theme, _params) => {
  return {
    navbar: {
      backgroundColor: "#7F1BA4",
      borderRadius: "10px",
      border: "1px solid rgba(41, 41, 47, 0.40)",
      background: "#161618",
      margin: "1rem",
      height: "calc(100vh - 2rem)",
    },

    navbarHeader: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[2]
        }`,
    },

    walletDetails: {
      borderRadius: "10px",
      background:
        "linear-gradient(110deg, rgba(90, 77, 255, 0.70) 1.33%, rgba(127, 27, 164, 0.70) 57.43%, rgba(252, 157, 57, 0.70) 119.39%)",
      backdropFilter: "blur(25px)",
      padding: "0.8rem 1rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.4rem",
      h4: {
        margin: 0,
        fontWeight: 500,
        fontSize: "1rem",
        span: {
          fontWeight: 400,
          fontSize: "0.9rem",
        },
      },
    },

    walletHeading: {
      display: "flex",
      alignItems: "center",
      gap: "0.2rem",
      fontSize: "0.8rem",
    },

    link: {
      fontFamily: "var(--base-font)",
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.md,
      color: "#fff",
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      marginBottom: `${theme.spacing.xs}px`,
      borderRadius: theme.radius.md,
      fontWeight: 500,
      borderLeft: "4px solid transparent",

      "&:hover": {
        borderLeft: "4px solid var(--Purple, #7F1BA4)",
        background: "var(--Rich-Black, #0D0D0F)",
      },
    },

    linkActive: {
      "&, &:hover": {
        borderLeftColor: "var(--primary-color)",
        background: "var(--Rich-Black, #0D0D0F)",
      },
    },

  };
});