import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import { applyMiddleware, createStore, Store } from 'redux'
import reducer from './store/reducer';
import thunk from 'redux-thunk';
import {
  UserState,
  UserAction,
  DispatchType,
} from './types'

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