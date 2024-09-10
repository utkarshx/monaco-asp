import { WebSocketMessageReader, WebSocketMessageWriter, toSocket } from "vscode-ws-jsonrpc";
import { MonacoLanguageClient } from "monaco-languageclient";
import { HELLO_LANG_ID } from "../editor/constants";

const LS_WS_URL = 'ws://localhost:8080'

export function connectToLs(): Promise<MonacoLanguageClient> {
    return new Promise((resolve, reject) => {
        const webSocket = new WebSocket(LS_WS_URL);

        webSocket.onopen = () => {
            console.log('LS WebSocket connection Open');
            const socket = toSocket(webSocket);
            const reader = new WebSocketMessageReader(socket);
            const writer = new WebSocketMessageWriter(socket);
            const languageClient = createLanguageClient(reader, writer);

            languageClient.onDidChangeState((event) => {
                console.log('Monaco Language Client State Changed:', event.newState);
            });

            // Add more detailed logging
            reader.onError((error) => console.error('Reader error:', error));
            writer.onError((error) => console.error('Writer error:', error));

            languageClient.start().then(() => {
                console.log('Language client started');
                resolve(languageClient);
            }).catch(error => {
                console.error('Failed to start language client:', error);
                reject(error);
            });
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

function createLanguageClient(reader: WebSocketMessageReader, writer: WebSocketMessageWriter): MonacoLanguageClient {
    return new MonacoLanguageClient({
        name: `${HELLO_LANG_ID} Language Client`,
        clientOptions: {
            documentSelector: [HELLO_LANG_ID],
            errorHandler: {
                error: () => ({ action: 1 }), // Continue
                closed: () => ({ action: 1 }) // DoNotRestart
            }
        },
        connectionProvider: {
            get: () => Promise.resolve({ reader, writer }),
        },
    });
}