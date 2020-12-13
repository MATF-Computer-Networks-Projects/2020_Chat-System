import React from 'react';
import RegisterUser from './components/RegisterUser';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import io from 'socket.io-client';
import './App.css';

const socket = io.connect(process.env.REACT_APP_SERVER_URL as string);

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path ='/'>
            <RegisterUser socket={socket}/>
          </Route>
          <Route exact path ='/home'>
            <Home socket={socket}/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
