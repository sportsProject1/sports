import './App.css';
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Provider} from "react-redux";
import 'reset-css';
import {RouterProvider} from "react-router-dom";
import Routes from "./Routes";
import {store} from './Store/store';

function App() {

  const [data,setData] = useState('')
  useEffect(() => {
    const fetchData = async () => {
      try{
        const response = await axios.get('http://localhost:8090/api/data');
        setData(response.data);
      }catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  console.log(data)

  return (

      <Provider store={store}>
        {/*<ThemeProvider theme={themeState === 'light' ? lightTheme : darkTheme}>*/}
          <RouterProvider router={Routes}/>
        {/*</ThemeProvider>*/}
      </Provider>
  );
}

export default App;
