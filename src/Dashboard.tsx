import { useEffect, useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  MediaQuery,
  Burger,
  useMantineTheme,
  createStyles,
  Group,
  ScrollArea,
  Button,
} from "@mantine/core";
import { ReactComponent as SnetLogo } from "./resources/assets/images/logo.svg";
import { ReactComponent as WalletIcon } from "./resources/assets/images/wallet.svg";
import { ReactComponent as LogoutIcon } from "./resources/assets/images/logout.svg";
import { useMediaQuery } from "@mantine/hooks";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";
import { Login } from "./Login";
import { ZeroDevWeb3Auth } from "@zerodev/web3auth";
import { useBalance, useDisconnect } from "wagmi";
import "./global.css";
import { AppConfig } from "./config";

const useStyles = createStyles((theme, _params) => {
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    main: {
      paddingLeft: '2rem',
      paddingTop: '1rem'
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    navbar: {
      backgroundColor: "#7F1BA4",
      borderRadius: "10px",
      border: "1px solid rgba(41, 41, 47, 0.40)",
      background: "#161618",
      margin: "1rem",
      height: "calc(100vh - 2rem)",
    },

    walletInfo: {
      display: 'flex',
      justifyContent: 'flex-end'
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

export interface DashboardProps {
  children: React.ReactNode;
  links: { path: string; label: string }[];
}

export function Dashboard({ children, links }: DashboardProps) {
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();
  const matches = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`);
  const mdMatches = useMediaQuery(`(min-width: ${theme.breakpoints.lg}px)`);
  const [opened, setOpened] = useState(false);
  const { pathname } = useLocation();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Fetching wallet balances
  const { address } = useAccount();
  const AGIXTokenAddress: any = AppConfig.AGIX_TOKEN; // Replace with AGIX token address
  const { data: ethBalance } = useBalance({
    address: address,
    watch: true,
  });

  const { data: agixBalance } = useBalance({
    address: address,
    token: AGIXTokenAddress,
    watch: true,
  });

  // Format ETH balance to 4 decimal places
  const formattedEthBalance = ethBalance
    ? parseFloat(ethBalance.formatted).toFixed(4)
    : "Loading...";

  useEffect(() => {
    if (isConnected) {
      const zeroDevWeb3Auth = new ZeroDevWeb3Auth([
        process.env.REACT_APP_ZERODEV_PROJECT_ID ||
          "ee19c5e2-578e-41e9-a92a-a322b08f2343",
      ]);
      //   zeroDevWeb3Auth.getUserInfo().then(console.log);
    }
  }, [isConnected]);

  if (!isConnected) {
    return <Login />;
  }
  return (
    <AppShell
      styles={{
        main: {
          background: theme.black,
          paddingTop: "1rem",
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 120, lg: 240 }}
          className={classes.navbar}
        >
          <Navbar.Section grow component={ScrollArea}>
            {matches ? (
              <MediaQuery
                largerThan={"sm"}
                styles={{ paddingLeft: 20, paddingRight: 20 }}
              >
                <Group className={classes.header} position="apart">
                  <SnetLogo width={"100%"} />
                </Group>
              </MediaQuery>
            ) : null}
            {links.map((item) => (
              <Link
                className={cx(classes.link, {
                  [classes.linkActive]: item.path === pathname,
                })}
                to={item.path}
                key={item.label}
                onClick={() => {
                  setOpened(false);
                }}
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </Navbar.Section>
          <Navbar.Section className={classes.walletDetails}>
            <div className={classes.walletHeading}>
              <WalletIcon /> WALLET BALANCE
            </div>
            <h4>
              <span>AGIX Token:</span> {agixBalance?.formatted ?? "Loading..."}{" "}
              AGIX
            </h4>
            <h4>
              <span>Ethereum:</span> {formattedEthBalance} ETH
            </h4>
          </Navbar.Section>
          <Button
            variant="filled"
            className="btn-secondary"
            onClick={() => {
              disconnect();
            }}
          >
            <LogoutIcon /> <span>Disconnect</span>
          </Button>
        </Navbar>
      }
      header={
        matches ? undefined : (
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Header height={{ base: 50, md: 70 }} p="md">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  height: "100%",
                }}
              >
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="sm"
                />

                <SnetLogo height={30} width={116} />
              </div>
            </Header>
          </MediaQuery>
        )
      }
    >
      {mdMatches && (
        <Navbar.Section className={classes.walletInfo}>
          <div className="ConnectedButtonClass">
            <ConnectButton showBalance={false} />
          </div>
        </Navbar.Section>
      )}
      <div className={classes.main}>
        {children}
      </div>
    </AppShell>
  );
}
