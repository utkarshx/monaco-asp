import { IWebSocket, WebSocketMessageReader, WebSocketMessageWriter } from 'vscode-ws-jsonrpc';
import { forward, createConnection, createServerProcess } from 'vscode-ws-jsonrpc/server';
import { InitializeRequest, Message, InitializeParams } from 'vscode-languageserver';
import * as path from 'path';

export const launch = (socket: IWebSocket) => {
    const reader = new WebSocketMessageReader(socket);
    const writer = new WebSocketMessageWriter(socket);

    const socketConnection = createConnection(reader, writer, () => socket.dispose());

    const serverModule = path.join(__dirname, '..', 'node_modules', 'sql-language-server', 'dist', 'bin', 'cli.js');
    const serverConnection = createServerProcess(
        'SQL',
        'node',
        [serverModule, 'up', '--method', 'stdio']
    );

    if (serverConnection) {
        forward(socketConnection, serverConnection, (message) => {
            try {
                if (Message.isRequest(message)) {
                    console.log("Request: --------------------------------");
                    console.log(JSON.stringify(message, null, 2));
                    console.log("Request End: --------------------------------");
                    if (message.method === InitializeRequest.type.method) {
                        const initializeParams = message.params as InitializeParams;
                        initializeParams.processId = process.pid;
                        message.params = initializeParams;
                    }
                }
                if (Message.isResponse(message)) {
                    console.log("Response: ------------------------------");
                    console.log(JSON.stringify(message, null, 2));
                    console.log("Response End: ------------------------------");
                }
                return message;
            } catch (error) {
                console.error('Error processing message:', error);
                return message;
            }
        });

        serverConnection.onClose(() => {
            console.log('Server connection closed');
            socket.dispose();
        });

    } else {
        console.error('Failed to create server connection');
        socket.dispose();
    }
};
