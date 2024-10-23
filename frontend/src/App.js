import './App.css';
import {useEffect, useState} from "react";
import axios from "axios";

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
      <div className="App">
        <h1>zz {data}</h1>
      </div>
  );
}

export default App;
