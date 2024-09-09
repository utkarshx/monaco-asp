import { IWebSocket, WebSocketMessageReader, WebSocketMessageWriter } from 'vscode-ws-jsonrpc'
import { createConnection, createServerProcess } from 'vscode-ws-jsonrpc/server'
import { InitializeRequest, Message, InitializeParams } from 'vscode-languageserver'
import * as path from 'path'

export const launch = (socket: IWebSocket) => {
    const reader = new WebSocketMessageReader(socket)
    const writer = new WebSocketMessageWriter(socket)

    const socketConnection = createConnection(reader, writer, () => socket.dispose())

    const serverModule = path.join(__dirname, '..',  'node_modules', 'typescript-language-server', 'lib', 'cli.mjs')
    const serverConnection = createServerProcess(
        'TypeScript',
        'node',
        [serverModule, '--stdio']
    )

    if (serverConnection) {
        socketConnection.forward(serverConnection, (message: Message) => {
            if (Message.isRequest(message)) {
                if (message.method === InitializeRequest.type.method) {
                    const initializeParams = message.params as InitializeParams;
                    initializeParams.processId = process.pid;
                    message.params = initializeParams;
                }
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
