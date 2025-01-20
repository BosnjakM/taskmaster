import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <div>
              <Navbar/>
          </div>
      </header>
    </div>
  );
}

export default App;
