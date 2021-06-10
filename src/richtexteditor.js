import {Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, ContentState} from 'draft-js';
import React from 'react';
import {useState, useRef, useEffect} from 'react';
import 'draft-js/dist/Draft.css';
import './richtexteditor.css';
import {Button, AppBar, Toolbar, MenuItem, Menu} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function RichEditor(){

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
    console.log("newnote");
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
    console.log("SAVED!");
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

  const classes = useStyles();
  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
        <AllStoredNotesMenu amountOfNotes={amountOfNotes}/>
          <Button variant="contained"
          onClick={() => saveContent(editorState.getCurrentContent())}>
            Save
          </Button>
          <div style={{marginLeft: '5px'}}></div>
          <Button variant="contained" onClick={() => newNote()}>
            New
          </Button>
        </Toolbar>
      </AppBar>
      <div className="RichEditor-root">
          <div className={className} onClick={focusOnEditor}>
            <Editor
                blockStyleFn={getBlockStyle}
                customStyleMap={styleMap}
                editorState={editorState}
                handleKeyCommand={handleKeyCommand}
                onChange={onChange}
                onTab={onTab}
                placeholder="Title goes on first line"
                ref={editor}
                spellCheck={false}
            />
          </div>
      </div>
      </>
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

  function AllStoredNotesMenu(props){
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    let keys = []
    for(let i = 0; i < props.amountOfNotes; i++){
      keys.push(i);
    }
    const classes = useStyles();
    return (
      <>
        <IconButton
        aria-label="menu"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={handleClose}
        >
            <MenuItem onClick={handleClose}>HEY</MenuItem>
        </Menu>
      </>
    );
  }

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

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

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
    {label: 'Monospace', style: 'CODE'},
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