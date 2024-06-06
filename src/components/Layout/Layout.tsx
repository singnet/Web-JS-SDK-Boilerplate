import { useState } from "react";
import {
  AppShell,
  useMantineTheme,
} from "@mantine/core";
import styles from "./Layout.styles";
import Login from "pages/Login/Login";
import AppNavbar from "components/Layout/Navbar/Navbar";
import MobileHeader from "./MobileHeader/MobileHeader";
import { useMediaQuery } from "@mantine/hooks";
import { useAccount } from "wagmi";

export interface LayoutProps {
  children: React.ReactNode;
  links: { path: string; label: string }[];
}

export function Layout({ children, links }: LayoutProps) {
  const { classes } = styles();
  const [opened, setOpened] = useState<boolean>(false);
  const { isConnected } = useAccount();
  const theme = useMantineTheme();
  const matches = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`);
  if (!isConnected) {
    return <Login />;
  }
  return (
    <AppShell
      className={classes.shell}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <AppNavbar opened={opened} setOpened={setOpened} links={links} />
      }
      header={
        matches ? undefined :
          <MobileHeader opened={opened} setOpened={setOpened} />
      }
    >
      <div className={classes.main}>
        {children}
      </div>
    </AppShell>
  );
}
