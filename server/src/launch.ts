import { IWebSocket, WebSocketMessageReader, WebSocketMessageWriter } from 'vscode-ws-jsonrpc'
import { forward, createConnection, createServerProcess } from 'vscode-ws-jsonrpc/server'
import { InitializeRequest, Message, InitializeParams } from 'vscode-languageserver'
import * as path from 'path'

export const launch = (socket: IWebSocket) => {
    const reader = new WebSocketMessageReader(socket)
    const writer = new WebSocketMessageWriter(socket)

    const socketConnection = createConnection(reader, writer, () => socket.dispose())

    const serverModule = path.join(__dirname, '..', 'node_modules', 'sql-language-server', 'dist', 'bin', 'cli.js')
    const serverConnection = createServerProcess(
        'SQL',
        'node',
        [serverModule, 'up', '--method', 'stdio']
    )


    if (serverConnection) {
        forward(socketConnection, serverConnection, (message) => {
            if (Message.isRequest(message)) {
                console.log("Request: --------------------------------")
                console.log(message)
                console.log("Request End: --------------------------------")
                if (message.method === InitializeRequest.type.method) {
                    const initializeParams = message.params as InitializeParams;
                    initializeParams.processId = process.pid;
                    message.params = initializeParams; //Check
                }
            }
            if (Message.isResponse(message)) {
                console.log("Response: ------------------------------")
                console.log(message);
                console.log("Response End: ------------------------------")
            }
            return message;
        })

        serverConnection.onClose(() => {
            console.log('Server connection closed');
            socket.dispose();
        });

        // serverConnection.onError(error => {
        //     console.error('Server connection error:', error);
        //     socket.dispose();
        // });
    } else {
        console.error('Failed to create server connection');
        socket.dispose();
    }
}