import './App.css';
import { StyledInput, StyledInputDiv, StyledPlaceHolder, MyEditor } from './style';
import {useState} from 'react';
import React from 'react';
import RichEditorExample from './richtexteditor.js'

function App() {
  return (
    <div className="App">
      <RichEditorExample />
    </div>
  );
}

export default App;
