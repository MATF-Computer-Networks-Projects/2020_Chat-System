import React from 'react';
import { useSelector, shallowEqual, useDispatch } from "react-redux"
import io from 'socket.io-client';
import { BrowserRouter as Router, Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import RegisterUser from './components/RegisterUser';
import Home from './components/Home';
import './App.css';

import { addUser, removeUser} from './store/actionCreators';
import { Dispatch } from 'redux';


function App() {
  // const socket = io.connect(process.env.REACT_APP_SERVER_URL as string);
  console.log(process.env.REACT_APP_SERVER_URL);

  const users: readonly IUser[] = useSelector(
    (state: UserState) => state.users,
    shallowEqual
  );

  const dispatch: Dispatch = useDispatch();

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path='/'> 
            <RegisterUser 
              addUser={addUser} 
            />
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
