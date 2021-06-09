import './App.css';
import { StyledInput, StyledInputDiv, StyledPlaceHolder, MyEditor } from './style';
import {useState} from 'react';
import React from 'react';
import RichEditor from './richtexteditor.js'

function App() {
  return (
    <div className="App">
      <RichEditor />
    </div>
  );
}

export default App;
