import MonacoEditor, { EditorDidMount } from "react-monaco-editor";
import React, { useState, useEffect } from "react";
import { connectToLs } from "../ls-client/ws-client";
import { HELLO_LANG_ID, MONACO_OPTIONS } from "./constants";
import { createModel, registerLanguage } from "./util";
// import { languages, editor } from "monaco-editor/esm/vs/editor/editor.api"
// import * as monaco from 'monaco-editor';

export function Editor() {
    const [isEditorReady, setIsEditorReady] = useState(false);

    useEffect(() => {
        setIsEditorReady(true);
    }, []);
    const editorDidMount: EditorDidMount = async (editor, monaco) => {
        await registerLanguage();
        const model = createModel();
        editor.setModel(model);
        await connectToLs();
        editor.focus();
    };
    // const onChange = (newValue: any, e: any) => {
    //     console.log('onChange', newValue, e);
    //   }

    return (
        <div>
            <div>
                <h3>Web Editor</h3>
            </div>
            <div>
            {isEditorReady && (
                    <MonacoEditor
                        width="100%"
                        height="80vh"
                        language={HELLO_LANG_ID}
                        theme="vs"
                        options={MONACO_OPTIONS}
                        editorDidMount={editorDidMount}
                    />
                )}
            </div>
        </div>
    );
}