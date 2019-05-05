import React, { Component } from 'react';
import './App.css';
import GameBoard from './components/GameBoard'

class App extends Component {  
  render() {
    return (
      <div className="container">
        <div>
            <GameBoard/>
        </div>
        
      </div>
    );
  }
}

export default App;
