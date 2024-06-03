import { Title, Container, Flex } from '@mantine/core';
import { ReactComponent as ZeroDevLogo } from 'resources/assets/images/logo.svg';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from './Login.styles';

export function Login() {
  const { classes } = styles();

  return (
    <div className={classes.wrapper}>
      <Container>
        <Flex justify={"center"} align="center" mih={'100%'} direction={'column'} gap={30}>
          <ZeroDevLogo className={classes.logo} width={300} height={'100%'} />
          <video className={classes.introVideo} muted autoPlay loop src="/SingularityNET_Demo-HeaderAnim.mp4" width={350} height={350} />
          <Title className={classes.title}>
            Web SDK Boilerplate
          </Title>
          <div className="start-demo">
            <ConnectButton label={"Start Demo"} />
          </div>
        </Flex>
      </Container>
    </div>
  );
}
