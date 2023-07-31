import React from 'react';
import './App.css';
import HangulConverter from './HangulConverter';

function App() {
  return (
    <div className="App">
      <header className='App-header'>옛 한글 조합기</header>
      <div className='body'>
        <HangulConverter></HangulConverter>
      </div>
    </div>
  );
}

export default App;
