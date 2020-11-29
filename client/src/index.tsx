import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { useSelector, shallowEqual, useDispatch } from "react-redux"
import reducer from './store/reducer';
import { createStore, applyMiddleware, Store } from "redux"
import thunk from "redux-thunk"



const store: Store<UserState, UserAction> & {
  dispatch: DispatchType
} = createStore(reducer, applyMiddleware(thunk))


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);