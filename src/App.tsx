import React from 'react';
import logo from './logo.svg';
import './App.css';
import Hangul from './Hangul';
import HangulConverter from './HangulConverter';

function App() {
  return (
    <div className="App">
      <header className='App-header'>옛 한글 조합기</header>
      <HangulConverter></HangulConverter>
    </div>
  );
}

export default App;
