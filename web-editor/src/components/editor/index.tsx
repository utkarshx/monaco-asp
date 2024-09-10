import MonacoEditor, { EditorDidMount } from "react-monaco-editor";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { connectToLs } from "../ls-client/ws-client";
import { HELLO_LANG_ID, MONACO_OPTIONS } from "./constants";
import { createModel, registerLanguage } from "./util";
import { MonacoLanguageClient } from "monaco-languageclient";
import * as monacodef from "monaco-editor"

export function Editor() {
    const [isEditorReady, setIsEditorReady] = useState(false);
    const editorRef = useRef(null);
    const isLsConnectedRef = useRef(false);
    const mountCountRef = useRef(0);
    const languageClientRef = useRef<MonacoLanguageClient | null>(null);

    useEffect(() => {
        const initEditor = async () => {
            await registerLanguage();
            setIsEditorReady(true);
        };
        initEditor();
    }, []);

    const editorDidMount = useCallback<EditorDidMount>(async (editor, monaco) => {
        mountCountRef.current += 1;
        console.log(`editorDidMount called (count: ${mountCountRef.current})`);
        
        editorRef.current = editor;

        if (!isLsConnectedRef.current) {
            console.log("Connecting to LS");
            const model = createModel();
            editor.setModel(model);
          
            try {
                const languageClient = await connectToLs();
                languageClientRef.current = languageClient;
                isLsConnectedRef.current = true;
                console.log("Connected to LS");

                /**************************** */
                // Add message logging
                languageClient.onNotification('any',(method, params) => {
                    console.log('Received notification:', method, params);
                });

                languageClient.onRequest('any',(method, params) => {
                    console.log('Received request:', method, params);
                    return null;
                });
                /************************** */

                // Add content change listener
                // editor.onDidChangeModelContent((event) => {
                //     console.log("Editor content changed:", event);
                //     // You can add more specific logging or handling here
                // });

                // Register the language client with Monaco
                // monaco.languages.registerCompletionItemProvider(HELLO_LANG_ID, {
                //     provideCompletionItems: (model, position) => {
                //         console.log("Completion requested:", model.uri.toString(), position);
                //         return languageClient.sendRequest('textDocument/completion', {
                //             textDocument: { uri: model.uri.toString() },
                //             position: position
                //         }).then((result) => {
                //             console.log("Completion result:", result);
                //             return { suggestions: result as monacodef.languages.CompletionItem[] };
                //         });
                //     }
                // });

                // Add content change listener
                editor.onDidChangeModelContent((event) => {
                    console.log("Editor content changed:", event);
                    const position = editor.getPosition();
                    languageClient.sendNotification('textDocument/didChange', {
                        textDocument: { uri: model.uri.toString() },
                        contentChanges: [{ text: editor.getValue() }]
                    });
                });

                // Add diagnostics change listener
                languageClient.onDidChangeState((state) => {
                    console.log("Language client state changed:", state);
                });

                monaco.languages.registerCompletionItemProvider(HELLO_LANG_ID, {
                    provideCompletionItems: (model, position) => {
                        console.log("Completion requested:", model.uri.toString(), position);
                        return { suggestions: [] };
                    }
                });

            } catch (error) {
                console.error("Failed to connect to LS:", error);
            }
        } else {
            console.log("LS already connected, skipping");
        }

        editor.focus();
    }, []);

    return (
        <div>
            <div>
                <h3>Web Editor</h3>
            </div>
            <div>
                {isEditorReady && (
                    <MonacoEditor
                        key="monaco-editor"
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