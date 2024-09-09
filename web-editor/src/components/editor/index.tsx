import MonacoEditor, { EditorDidMount } from "react-monaco-editor";
import React, { useState, useEffect, useRef } from "react";
import { connectToLs } from "../ls-client/ws-client";
import { HELLO_LANG_ID, MONACO_OPTIONS } from "./constants";
import { createModel, registerLanguage } from "./util";

export function Editor() {
    const [isEditorReady, setIsEditorReady] = useState(false);
    const editorRef = useRef(null);

    useEffect(() => {
        const initEditor = async () => {
            await registerLanguage();
            setIsEditorReady(true);
        };
        initEditor();
    }, []);

    const editorDidMount: EditorDidMount = async (editor, monaco) => {
        editorRef.current = editor;
        console.log(!editorRef.current.isLsConnected)
        // Ensure that connectToLs is called only once
        if (!editorRef.current.isLsConnected) {
            const model = createModel();
            editor.setModel(model);
          
            await connectToLs();
            editorRef.current.isLsConnected = true; // Mark as connected
        }

        editor.focus();
    };

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
