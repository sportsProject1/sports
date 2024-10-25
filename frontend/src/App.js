import './App.css';
import React, {useState} from "react";
import {Provider} from "react-redux";
import 'reset-css';
import {RouterProvider} from "react-router-dom";
import Routes from "./Routes";
import store from "./Store/store"
import {ThemeProvider} from "styled-components";
import {darkTheme, lightTheme} from "./styled/theme";
import GlobalStyle from "./styled/GlobalStyle";

function App() {

    const [themeState, setThemeState] = useState("light");

  return (

      <Provider store={store}>
        <ThemeProvider theme={themeState === 'light' ? lightTheme : darkTheme}>
            <GlobalStyle/>
          <RouterProvider router={Routes}/>
        </ThemeProvider>
      </Provider>
  );
}

export default App;
