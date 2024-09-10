import MonacoEditor, { EditorDidMount } from "react-monaco-editor";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { HELLO_LANG_ID, MONACO_OPTIONS } from "./constants";
import {  registerLanguage } from "./util";
import { MonacoLanguageClient } from "monaco-languageclient";
import { WebSocketMessageReader, WebSocketMessageWriter, toSocket } from 'vscode-ws-jsonrpc';
import { CloseAction, ErrorAction, MessageTransports } from 'vscode-languageclient';

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

    const createLanguageClient = (transports: MessageTransports): MonacoLanguageClient => {
        return new MonacoLanguageClient({
            name: 'Sample Language Client',
            clientOptions: {
                documentSelector: ["json"],
                errorHandler: {
                    error: () => ({ action: ErrorAction.Continue }),
                    closed: () => ({ action: CloseAction.DoNotRestart })
                }
            },
            connectionProvider: {
                get: () => Promise.resolve(transports)
            }
        });
    };

    const initWebSocketAndStartClient = (url: string): WebSocket => {
        const webSocket = new WebSocket(url);
        webSocket.onopen = () => {
            const socket = toSocket(webSocket);
            const reader = new WebSocketMessageReader(socket);
            const writer = new WebSocketMessageWriter(socket);
            const languageClient = createLanguageClient({ reader, writer });
            languageClientRef.current = languageClient;
            languageClient.start();
            reader.onClose(() => languageClient.stop());
            isLsConnectedRef.current = true;
            console.log("Connected to LS");
        };
        return webSocket;
    };

    const editorDidMount = useCallback<EditorDidMount>(async (editor, monaco) => {
        mountCountRef.current += 1;
        console.log(`editorDidMount called (count: ${mountCountRef.current})`);
        
        editorRef.current = editor;

        if (!isLsConnectedRef.current) {
            console.log("Connecting to LS");
            // const model = createModel();
            // editor.setModel(model);
          
            try {
                const webSocket = initWebSocketAndStartClient('ws://localhost:30000/sampleServer');

                // Add content change listener
                // editor.onDidChangeModelContent((event) => {
                //     console.log("Editor content changed:", event);
                //     if (languageClientRef.current) {
                //         const content = editor.getValue();
                //         languageClientRef.current.sendNotification('textDocument/didChange', {
                //             textDocument: {
                //                 uri: model.uri.toString(),
                //                 version: model.getVersionId()
                //             },
                //             contentChanges: [{ text: content }]
                //         });
                //     }
                // });

                // Add diagnostics change listener
                languageClientRef.current?.onDidChangeState((state) => {
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