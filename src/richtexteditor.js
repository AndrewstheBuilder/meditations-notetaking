import {Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, ContentState} from 'draft-js';
import React from 'react';
import {useState, useRef, useEffect} from 'react';
import 'draft-js/dist/Draft.css';
import './richtexteditor.css';
import {Button} from '@material-ui/core';

function RichEditor( ){
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty()
  );
  const [currentNote, setCurrentNote] = useState(0);
  const [amountOfNotes, setAmountOfNotes] = useState(0);
  const editor = useRef(null);

  /*On componentDidUpdate*/
  useEffect( () => {
    const contentState = editorState.getCurrentContent();
    saveContent(contentState);
    focusOnEditor();
    }
  )

  /*On componentDidMount*/
  useEffect( () => {

    // TODO: Maintain data persistence
    const content = window.localStorage.getItem(currentNote);

    if (content) {
      setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(content))));
    } else {
      setEditorState(EditorState.createEmpty());
    }

  }, [])


  function onChange(editorState){
    setEditorState(editorState);
  }

  function handleKeyCommand(command){
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if(newState){
      onChange(newState);
      return true;
    }
    return false;
  }

  function newNote(){
    setCurrentNote(currentNote+1);
    setAmountOfNotes(amountOfNotes+1);
    const newEditorState = EditorState.push(editorState, ContentState.createFromText(''));
    setEditorState(newEditorState);

    /*Save new note*/
    const currentContent = editorState.getCurrentContent();
    saveContent(currentContent);
  }

  function onTab(e){
      const maxDepth = 6;
      onChange(RichUtils.onTab(e, editorState, maxDepth));
      setEditorState( RichUtils.onTab(e, editorState, maxDepth) );
  }

  function toggleBlockType(blockType){
    onChange(
          RichUtils.toggleBlockType(
              editorState,
              blockType
          )
    )
  }

  function toggleInlineStyle(inlineStyle){
    onChange(
        RichUtils.toggleInlineStyle(
            editorState,
            inlineStyle
        )
    )
  }

  function focusOnEditor(){
      editor.current.focus();
  }

  /*Save to local storage*/
  function saveContent(content)  {
    //let noteTitle = convertToRaw(content).blocks[0].text;
    window.localStorage.setItem(currentNote, JSON.stringify(convertToRaw(content)));
  }

  // If the user changes block type before entering any text, we can
  // either style the placeholder or hide it. Let's just hide it now.
  let className = 'RichEditor-editor';
  var contentState = editorState.getCurrentContent();
  if (!contentState.hasText())
  {
    if (contentState.getBlockMap().first().getType() !== 'unstyled')
    {
      className += ' RichEditor-hidePlaceholder';
    }
  }

  return (
      <div className="RichEditor-root">
          <BlockStyleControls
          editorState={editorState}
          onToggle={toggleBlockType}
          />
          <Button
          variant="contained"
          color="primary"
          onClick={newNote}>
              New
          </Button>
          <br></br>
          <InlineStyleControls
          editorState={editorState}
          onToggle={toggleInlineStyle}
          />
          <div className={className} onClick={focusOnEditor}>
          <Editor
              blockStyleFn={getBlockStyle}
              customStyleMap={styleMap}
              editorState={editorState}
              handleKeyCommand={handleKeyCommand}
              onChange={onChange}
              onTab={onTab}
              placeholder="Write a note..."
              ref={editor}
              spellCheck={true}
          />
          </div>
    </div>
  );

}

// Custom overrides for "code" style.
const styleMap = {
    CODE: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2,
    },
  };

  function getBlockStyle(block) {
    switch (block.getType()) {
      case 'blockquote': return 'RichEditor-blockquote';
      default: return null;
    }
  }

  function StyleButton(props) {
      function onToggle(e) {
        e.preventDefault();
        props.onToggle(props.style);
      };


      let className = 'RichEditor-styleButton';
      if (props.active) {
        className += ' RichEditor-activeButton';
      }

      return (
        <span className={className} onMouseDown={onToggle}>
          {props.label}
        </span>
      );
  }

  const BLOCK_TYPES = [
    {label: 'H1', style: 'header-one'},
    {label: 'H2', style: 'header-two'},
    {label: 'H3', style: 'header-three'},
    {label: 'H4', style: 'header-four'},
    {label: 'H5', style: 'header-five'},
    {label: 'H6', style: 'header-six'},
    {label: 'Blockquote', style: 'blockquote'},
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'},
    {label: 'Code Block', style: 'code-block'},
  ];

  const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    return (
      <div className="RichEditor-controls">
        {BLOCK_TYPES.map((type) =>
          <StyleButton
            key={type.label}
            active={type.style === blockType}
            label={type.label}
            onToggle={props.onToggle}
            style={type.style}
          />
        )}
      </div>
    );
  };

  var INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Underline', style: 'UNDERLINE'},
    {label: 'Monospace', style: 'CODE'}
  ];

  const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
      <div className="RichEditor-controls">
        {INLINE_STYLES.map(type =>
          <StyleButton
            key={type.label}
            active={currentStyle.has(type.style)}
            label={type.label}
            onToggle={props.onToggle}
            style={type.style}
          />
        )}
      </div>
    );
  };

  export default RichEditor;