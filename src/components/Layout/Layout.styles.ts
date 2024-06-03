import { createStyles } from "@mantine/core";

export default createStyles((theme, _params) => {
  return {
    shell: {
      background: theme.black,
      paddingTop: '1rem'
    },

    main: {
      paddingLeft: '2rem',
      paddingTop: '1rem'
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
    }
  };
});