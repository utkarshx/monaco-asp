import { IWebSocket, WebSocketMessageReader, WebSocketMessageWriter } from 'vscode-ws-jsonrpc'
import {forward, createConnection, createServerProcess} from 'vscode-ws-jsonrpc/server'
import { InitializeRequest, Message, InitializeParams } from 'vscode-languageserver'
import { resolve } from 'path'

// const isInitializeRequest = (message: rpc.RequestMessage) =>
//     message.method === InitializeRequest.type.method

export const launch = (socket: IWebSocket) => {
    const reader = new WebSocketMessageReader(socket)
    const writer = new WebSocketMessageWriter(socket)

    const socketConnection = createConnection(reader, writer, () =>
        socket.dispose()
    )
    const serverConnection = createServerProcess(
        'LuaU',
        resolve(process.cwd(), './luau-lsp.exe'), ["lsp", "--docs=./en-us.json", "--definitions=./globalTypes.d.lua", "--base-luaurc=./.luaurc"]
    )
    if(serverConnection){
        forward(socketConnection, serverConnection, (message) => {
            // if (rpc.isRequestMessage(message) && isInitializeRequest(message)) {
            //     message.params.processId = process.pid
            // }
            // return message
            if (Message.isRequest(message)) {
                console.log(message)
                if (message.method === InitializeRequest.type.method) {
                    const initializeParams = message.params as InitializeParams;
                    initializeParams.processId = process.pid;
                    message.params = initializeParams; //Check
                }
            }
            if (Message.isResponse(message)) {
                console.log(message);
            }
            return message;
        })
    }
    
}
