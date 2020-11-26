import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import RegisterUserForm from './components/RegisterUserForm';

import io from 'socket.io-client';
import './App.css';

function App() {
  // const socket = io.connect(process.env.REACT_APP_SERVER_URL as string);
  console.log(process.env.REACT_APP_SERVER_URL);
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path='/' component={RegisterUserForm}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
