import { Dispatch, SetStateAction } from "react";
import {
  Navbar,
  MediaQuery,
  useMantineTheme,
  Group,
  ScrollArea,
  Button,
} from "@mantine/core";
import { ReactComponent as SnetLogo } from "resources/assets/images/logo.svg";
import { ReactComponent as WalletIcon } from "resources/assets/images/wallet.svg";
import { ReactComponent as LogoutIcon } from "resources/assets/images/logout.svg";
import { useMediaQuery } from "@mantine/hooks";
import { Link, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";
import { useBalance, useDisconnect } from "wagmi";
import styles from "./Navbar.styles";
import { appConfig } from "config/app";

export interface NavbarProps {
  links: { path: string; label: string }[];
  opened: boolean,
  setOpened: Dispatch<SetStateAction<boolean>>
}

const AppNavbar: React.FC<NavbarProps> = ({ links, opened, setOpened }) => {
  const { classes, cx } = styles();
  const theme = useMantineTheme();
  const matches = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`);
  const { pathname } = useLocation();
  const { disconnect } = useDisconnect();

  // Fetching wallet balances
  const { address } = useAccount();
  const AGIXTokenAddress: any = appConfig.agixToken;
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

  return (
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
            <Group className={classes.navbarHeader} position="apart">
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
  );
}

export default AppNavbar;
