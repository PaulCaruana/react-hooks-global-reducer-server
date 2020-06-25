import React from 'react';
import UserHome from "./scenes/user";
//import useCounter from "./services/counter/CounterService";
//import Counters from "./scenes/counter/Counters";

import './index.css';

function App() {
  //const {count, increment, decrement} = useCounter();
  return (
      <div>
        <UserHome />
{/*
        <p />
        <Counters count={count} increment={increment} decrement={decrement} />
*/}
      </div>
  );
}

export default App;
