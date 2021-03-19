import PersistentDrawerLeft from "./containers/AppBar.js";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import indigo from "@material-ui/core/colors/indigo";

function App() {
  const theme = createMuiTheme({
    typography: {
      // In Chinese and Japanese the characters are usually larger,
      // so a smaller fontsize may be appropriate.
      fontSize: 16
    }
  });
  return (
    <div className="App">
      <SnackbarProvider maxSnack={3}>
        <ThemeProvider theme={theme}>
          <PersistentDrawerLeft />
        </ThemeProvider>
      </SnackbarProvider>
    </div>
  );
}

export default App;
