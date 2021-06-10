import styled from 'styled-components';
import React from 'react';
import {Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

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

  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  }));

  export function NestedList(listTitle, listItem) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
      setOpen(!open);
    };

    return (
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={classes.root}
      >
        <ListItem button onClick={handleClick}>
          <ListItemText primary="" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button className={classes.nested}>
              <ListItemText primary="Starred" />
            </ListItem>
          </List>
        </Collapse>
      </List>
    );
  }