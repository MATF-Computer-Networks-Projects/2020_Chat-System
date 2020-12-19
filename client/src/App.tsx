import React from 'react';
import RegisterUser from './components/RegisterUser';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { v4 as uuidv4} from 'uuid';
import { SocketProvider } from './contexts/SocketProvider';
import { useDispatch } from 'react-redux';
import { addUserId } from './store/actionCreators';

import './App.css';

const userId = uuidv4();

function App() {

  const dispatch = useDispatch();
  const addUserIdCallback = React.useCallback(
    (userId: string) => dispatch(addUserId(userId)),
    [dispatch]
  )
  addUserIdCallback(userId);

  return (
    <div className="App">
      <SocketProvider userId={userId}>
        <Router>
          <Switch>
            <Route exact path ='/'>
              <RegisterUser/>
            </Route>
            <Route exact path ='/home'>
              <Home/>
            </Route>
          </Switch>
        </Router>
      </SocketProvider>
    </div>
  );
}

export default App;
