import { CookiesProvider } from "react-cookie";
import { AuthProvider, AxiosProvider, ThemeProvider } from "./Contexts";
import { Router } from "./Router/Router";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <>
      <CookiesProvider>
        <AuthProvider>
          <AxiosProvider>
            <ThemeProvider>
              <Router />
            </ThemeProvider>
          </AxiosProvider>
        </AuthProvider>
      </CookiesProvider>
    </>
  );
}

export default App;