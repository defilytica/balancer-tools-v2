import { PaletteMode } from "@mui/material";
import { alpha } from "@mui/material";

export const getThemeDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
        // palette values for light mode
        primary: {
          main: '#3b82f6',
        },
      }
      : {
        // palette values for dark mode
        primary: {
          main: '#3b82f6',
        },
        secondary: {
          main: '#d97706',
        },
        background: {
          paper: alpha('#141e30', 0.9),
          default: '#141e30',
        },
      }),
    overrides: {
      MuiCssBaseline: {
        '@global': {
          body: {
            transition: 'all 2s linear',
          },
        },
      },
    },
  },
  //Background gradient overrides
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: mode === 'dark' ? "linear-gradient(to right, #141e30, #243b55)" : 'linear-gradient(to right, #ece9e6, #ffffff)',
        },
      },
    },
  }
});
