import styled from 'styled-components';
import React from 'react';
import {Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';

/*export const StyledInput = styled.textarea`
    color:purple;
`
export const StyledInputDiv = styled(
    ({...rest}) => (
        <div contentEditable='true' {...rest}>

        </div>
    )
)`
 height: '50%';
`

export const StyledPlaceHolder = styled(
    ({...rest}) => (
        <div contentEditable='true' classes={{root:'root'}} {...rest}>

        </div>
    )
)`
    color:'#fff';
`;

export const MyEditor = () => {
    const [editorState, setEditorState] = React.useState(() =>
      EditorState.createEmpty()
    );

    const editor = React.useRef(null);
    function focusEditor() {
      editor.current.focus();
    }

    return (
      <div
        style={{margin: '5px', padding: '10px', minHeight: "90vh", cursor: "text" }}
        onClick={focusEditor}
      >
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={setEditorState}
          placeholder="Write something!"
        />
      </div>
    );
  }*/

  export const RichEditor = styled(
    ({...rest}) => (
      <Editor {...rest}/>
    )
  );
