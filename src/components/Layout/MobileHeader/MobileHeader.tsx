import { Dispatch, SetStateAction } from "react";
import {
  Header,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import { ReactComponent as SnetLogo } from "resources/assets/images/logo.svg";

export interface MobileHeaderProps {
  opened: boolean,
  setOpened: Dispatch<SetStateAction<boolean>>
}

export function MobileHeader({ opened, setOpened }: MobileHeaderProps) {
  const theme = useMantineTheme();

  return (
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
  );
}
