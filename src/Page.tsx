import {
    createStyles,
    Title,
    Text,
    Container,
    Flex,
    Box,
    Anchor,
    useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import  './global.css';


const useStyles = createStyles((theme, _params) => {
    return {
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

        button: {
            fontFamily: 'alias',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              fontSize: theme.fontSizes.md,
              color: theme.black,
              padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
              marginBottom: `${theme.spacing.xs}px`,
              borderRadius: theme.radius.md,
              fontWeight: 500,
              border: '1px solid black',
  
              '&:hover': {
                  backgroundColor: theme.white,
                  color: "#7F1BA4",
              },
          },
  
  
          linkActive: {
              '&, &:hover': {
                  backgroundColor: theme.black,
                  color:  "#7F1BA4",
                
              },
          },

        highlight: {
            color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6],
        },
        description: {
            textAlign: 'center',
            whiteSpace: 'pre-line',
            '@media (max-width: 520px)': {
                fontSize: theme.fontSizes.md,
            },
        },
    };
});

export interface DashboardProps {
    children: React.ReactNode;
    title: string;
    description?: string;
    docs?: string;
}

export function Page({ children, title, description, docs }: DashboardProps) {
    const { classes } = useStyles();
    const theme = useMantineTheme()
    const matches = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);

    return (
        <Flex direction={'column'} mih={'100%'} align={'center'} justify={'flex-start'} mt={30}>
            {matches && <ConnectButton />}
                <Container style={{flex: 1, marginTop: 30}}>
                    <Box mb={50} style={{ textAlign: 'center' }}>
                        <Title className={classes.title}>{title}</Title>
                        <Container p={0} size={600}>
                            <Text size="lg" color="dimmed" className={classes.description}>
                                {description}
                            </Text>
                        </Container>
                        {docs &&
                            <Anchor href={docs} target={'_blank'}>Check out the docs</Anchor>
                        }
                    </Box>
                    {children}
                </Container>
        </Flex>
    );
}