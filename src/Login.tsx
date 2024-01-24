import { createStyles, Title, Text, Container, Flex, Button } from '@mantine/core';
import { ReactComponent as ZeroDevLogo } from './resources/assets/images/logo.svg';
import { ConnectButton } from '@rainbow-me/rainbowkit';
// import Passkey from './Passkey';
import  './global.css';


const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',

    '@media (max-width: 755px)': {
      paddingTop: 80,
      paddingBottom: 60,
    },
  },

  title: {
    textAlign: 'center',
    fontWeight: 800,
    fontSize: 40,
    letterSpacing: -1,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `alias`,

    '@media (max-width: 520px)': {
      fontSize: 28,
    },
  },

  highlight: {
    color: theme.colors.pink[0],
  },
}));

export function Login() {
  const { classes } = useStyles();

  return (
    <Container h={'100vh'}>
      <Flex justify={"center"} align="center" mih={'100%'} direction={'column'} gap={30}>
        <ZeroDevLogo width={300} height={'100%'} />
        <Title className={classes.title}>
        Snet Boilerplate<br />
          <Text component="span" className={classes.highlight} inherit>
          Google Auth Login Page
          </Text>
        </Title>
        <ConnectButton label={"Start Demo"} />
        If you're signing up, we will create a new AA wallet for you.
        {/* <Passkey />
        ZeroDev will create an AA wallet for you using passkeys. */}
      </Flex>
    </Container>
  );
}