import React from 'react';
import RegisterUser from './components/RegisterUser';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { v4 as uuidv4} from 'uuid';
import { SocketProvider } from './contexts/SocketProvider';

import './App.css';

const userId = uuidv4();

function App() {
  return (
    <div className="App">
      <SocketProvider userId={userId}>
        <Router>
          <Switch>
            <Route exact path ='/'>
              <RegisterUser userId={userId}/>
            </Route>
            <Route exact path ='/home'>
              <Home userId={userId}/>
            </Route>
          </Switch>
        </Router>
      </SocketProvider>
    </div>
  );
}

export default App;
