import { WebSocketMessageReader, WebSocketMessageWriter, toSocket } from "vscode-ws-jsonrpc";
import { CloseAction, ErrorAction } from "vscode-languageclient";
import { MonacoLanguageClient } from "monaco-languageclient";
import { HELLO_LANG_ID } from "../editor/constants";

const LS_WS_URL = 'ws://localhost:8080'
export function connectToLs() {
    return new Promise((resolve, reject) => {
        const webSocket = new WebSocket(LS_WS_URL);
        let isConnected = false;

        webSocket.onopen = () => {
            if (!isConnected) {
                isConnected = true;
                console.log('LS WebSocket connection Open');
                const socket = toSocket(webSocket);
                const reader = new WebSocketMessageReader(socket);
                const writer = new WebSocketMessageWriter(socket);
                const languageClient = new MonacoLanguageClient({
                    name: `${HELLO_LANG_ID} Language Client`,
                    clientOptions: {
                        documentSelector: [HELLO_LANG_ID],
                        errorHandler: {
                            error: () => ({ action: ErrorAction.Continue }),
                            closed: () => ({ action: CloseAction.DoNotRestart })
                        }
                    },
                    connectionProvider: {
                        get: () => Promise.resolve({reader, writer}),
                    },
                });

                languageClient.start().then(() => {
                    resolve(languageClient);
                }).catch(error => {
                    console.error('Failed to start language client:', error);
                    reject(error);
                });
            }
        }

        webSocket.onerror = (error) => {
            console.error('LS WebSocket connection Error:', error);
            reject(error);
        }

        webSocket.onclose = (event) => {
            console.log('LS WebSocket connection Closed:', event.code, event.reason);
        }
    });
}