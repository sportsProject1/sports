import './App.css';
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Provider} from "react-redux";
import 'reset-css';
import {RouterProvider} from "react-router-dom";
import Routes from "./Routes";
import {store} from './Store/store';

function App() {


  return (

      <Provider store={store}>
        {/*<ThemeProvider theme={themeState === 'light' ? lightTheme : darkTheme}>*/}
          <RouterProvider router={Routes}/>
        {/*</ThemeProvider>*/}
      </Provider>
  );
}

export default App;
