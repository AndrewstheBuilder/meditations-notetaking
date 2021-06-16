import React from 'react';
import Dante from 'dante3';
import {darkTheme, defaultTheme} from 'dante3';

export default function MediumEditor(props){
    return(
        <div style={{padding:"2% 20% 2%"}} >
            <Dante
            theme={defaultTheme}
            onUpdate={(editor)=>console.log(editor.getJSON())}/>
        </div>
    );
}