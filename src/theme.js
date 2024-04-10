import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#021024', // Darkest blue
      light: '#052659', // Second darkest blue
      dark: '#546E8B', // Mid-tone blue
      contrastText: '#ffffff', // For text that contrasts with the primary color
    },
    secondary: {
      main: '#7DA0CA', // Light blue
      light: '#C1E8FF', // Lightest blue, can be used as secondary light color
      dark: '#4B6587', // Can be a darker variation for the secondary color
      contrastText: '#000000', // For text that contrasts with the secondary color
    },
    background: {
      default: '#C1E8FF', // Lightest blue as background default
      paper: '#ffffff', // Light blue for background paper elements
    },
    text: {
      primary: '#021024', // Darkest blue for primary text
      secondary: '#546E8B', // Mid-tone blue for secondary text
    },
    // You can continue to add other colors and shades as necessary
  },
  // Other theme customizations
});

export default theme;



