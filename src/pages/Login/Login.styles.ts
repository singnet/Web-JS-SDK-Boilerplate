import { createStyles } from "@mantine/core";

export default createStyles((theme) => ({
    wrapper: {
        position: 'relative',
        backgroundImage: `url(/login-bg.jpg)`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        paddingTop: 40,
        paddingBottom: 30,
        minHeight: '100vh',

        '@media (max-width: 755px)': {
            paddingTop: 80,
            paddingBottom: 60,
            textAlign: 'center'
        },
    },

    title: {
        textAlign: 'center',
        fontWeight: 400,
        fontSize: 35,
        letterSpacing: -1,
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        marginBottom: '0rem',
        fontFamily: 'var(--base-font)',

        '@media (max-width: 520px)': {
            fontSize: 26,
            maxWidth: '320px',
        },
    },

    logo: {
        '@media (max-width: 520px)': {
            width: '12rem',
            position: 'relative',
            top: '2rem'
        },
    },

    highlight: {
        color: theme.colors.pink[0],
    },

    introVideo: {
        mixBlendMode: 'screen'
    },

    description: {
        '@media (max-width: 520px)': {
            maxWidth: '80%',
        },
    }
}));