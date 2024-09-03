import { WebSocketMessageReader, WebSocketMessageWriter, toSocket } from "vscode-ws-jsonrpc";
import { CloseAction, ErrorAction } from "vscode-languageclient";
import { MonacoLanguageClient } from "monaco-languageclient";

const LS_WS_URL = 'ws://localhost:8080'

export  function connectToLs() {
    // Wait for Monaco to be fully initialized

    return new Promise((resolve, reject) => {
        const webSocket = new WebSocket(LS_WS_URL);

        webSocket.onopen = () => {
            const socket = toSocket(webSocket);
            const reader = new WebSocketMessageReader(socket);
            const writer = new WebSocketMessageWriter(socket);
            const languageClient = new MonacoLanguageClient({
                name: 'Lua Language Client',
                clientOptions: {
                    documentSelector: ['lua'],
                    errorHandler: {
                        error: () => ({ action: ErrorAction.Continue }),
                        closed: () => ({ action: CloseAction.DoNotRestart })
                    }
                },
                connectionProvider: {
                    get: () => Promise.resolve({reader, writer}),
                },
            });

            languageClient.start()
                .then(() => console.log('language client started'))
                .finally(() => console.log('language client done'));

            reader.onClose(() => languageClient.stop());
            resolve(languageClient);
        }

        webSocket.onerror = (error) => {
            console.log('LS WebSocket Error');
            reject(error);
        }
    });
}