import React from 'react';
import io from 'socket.io-client';
import './App.css';

function App() {
  const socket = io.connect(process.env.REACT_APP_SERVER_URL as string);
  console.log(process.env.REACT_APP_SERVER_URL);
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Chat System
        </p>
      </header>
    </div>
  );
}

export default App;
