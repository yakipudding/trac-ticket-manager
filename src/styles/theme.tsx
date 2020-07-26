import { createMuiTheme } from '@material-ui/core/styles';
const Theme = createMuiTheme({
  "palette": { 
    "common": { 
      "black": "#000",
      "white": "#fff" 
    },
    "background": {
      "paper": "#fff",
      "default": "#F5F5F6"
    },
    "primary": {
      "light": "#ffa4a2",
      "main": "#e57373",
      "dark": "#af4448",
      "contrastText": "#ffebee" 
    },
    "secondary": { 
      "light": "#ffd149",
      "main": "#ffa000",
      "dark": "#c67100",
      "contrastText": "#000" 
    },
    "error": {
      "light": "#e57373", 
      "main": "#f44336", 
      "dark": "#d32f2f", 
      "contrastText": "#fff" 
    }, 
    "text": { 
      "primary": "#000", 
      "secondary": "#c79100", 
      "disabled": "rgba(128, 73, 71, 0.5)", 
      "hint": "rgba(0, 0, 0, 0.38)" 
    } 
  },
});
// typography
Theme.typography.h1 = {
  fontSize: 24,
  [Theme.breakpoints.up('md')]: {
    fontSize: 32,
  },
};
Theme.typography.h2 = {
  fontSize: 22,
  [Theme.breakpoints.up('md')]: {
    fontSize: 24,
  },
};
Theme.typography.h3 = {
  fontSize: 20.8,
};
Theme.typography.body2 = {
  fontSize: 12.8,
};
export default Theme