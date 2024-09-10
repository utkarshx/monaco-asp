/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2024 TypeFox and others.
 * Licensed under the MIT License. See LICENSE in the package root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as vscode from 'vscode';
import { RegisteredFileSystemProvider, registerFileSystemOverlay, RegisteredMemoryFile } from '@codingame/monaco-vscode-files-service-override';
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { MonacoEditorReactComp } from '@typefox/monaco-editor-react';
import { useWorkerFactory } from 'monaco-editor-wrapper/workerFactory';
import { createUserConfig } from './config.js';
import badPyCode from './bad.py?raw';
export const configureMonacoWorkers = () => {
    useWorkerFactory({
        ignoreMapping: true,
        workerLoaders: {
            editorWorkerService: () => new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url), { type: 'module' }),
        }
    });
};
export const runPythonReact = async () => {
    const badPyUri = vscode.Uri.file('/workspace/bad.py');
    const fileSystemProvider = new RegisteredFileSystemProvider(false);
    fileSystemProvider.registerFile(new RegisteredMemoryFile(badPyUri, badPyCode));
    registerFileSystemOverlay(1, fileSystemProvider);
    const onTextChanged = (textChanges) => {
        console.log(`Dirty? ${textChanges.isDirty}\ntext: ${textChanges.text}\ntextOriginal: ${textChanges.textOriginal}`);
    };
    const htmlElement = document.getElementById('monaco-editor-root');
    const root = ReactDOM.createRoot(htmlElement);
    try {
        document.querySelector('#button-start')?.addEventListener('click', async () => {
            const App = () => {
                return (React.createElement("div", { style: { 'height': '80vh', padding: '5px' } },
                    React.createElement(MonacoEditorReactComp, { userConfig: createUserConfig('/workspace', badPyCode, '/workspace/bad.py'), style: { 'height': '100%' }, onTextChanged: onTextChanged, onLoad: (wrapper) => {
                            console.log(`Loaded ${wrapper.reportStatus().join('\n').toString()}`);
                        }, onError: (e) => {
                            console.error(e);
                        } })));
            };
            const strictMode = document.getElementById('checkbox-strictmode').checked;
            if (strictMode) {
                root.render(React.createElement(StrictMode, null,
                    React.createElement(App, null)));
            }
            else {
                root.render(React.createElement(App, null));
            }
        });
        document.querySelector('#button-dispose')?.addEventListener('click', () => {
            root.render([]);
        });
    }
    catch (e) {
        console.error(e);
    }
};
//# sourceMappingURL=reactPython.js.map