import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import RegisterUser from './components/RegisterUser';
import Home from './components/Home';
import './App.css';

function App() {
  console.log(process.env.REACT_APP_SERVER_URL);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path='/'> 
            <RegisterUser/>
          </Route> 
          <Route exact path='/home'>
            <Home/>
          </Route> 
        </Switch>
      </Router>
    </div>
  );
}

export default App;
