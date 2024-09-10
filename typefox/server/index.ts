import { WebSocketServer } from 'ws';
import { Server } from 'node:http';
import express from 'express';


export const launchLanguageServer = (runconfig, socket: IWebSocket) => {
    const { serverName, runCommand, runCommandArgs, spawnOptions } = runconfig;
    // start the language server as an external process
    const reader = new WebSocketMessageReader(socket);
    const writer = new WebSocketMessageWriter(socket);
    const socketConnection = createConnection(reader, writer, () => socket.dispose());
    const serverConnection = createServerProcess(serverName, runCommand, runCommandArgs, spawnOptions);
    if (serverConnection) {
        forward(socketConnection, serverConnection, message => {
            if (Message.isRequest(message)) {
                console.log(`${serverName} Server received:`);
                console.log(message);
                if (message.method === InitializeRequest.type.method) {
                    const initializeParams = message.params as InitializeParams;
                    initializeParams.processId = process.pid;
                }
            }
            if (Message.isResponse(message)) {
                console.log(`${serverName} Server sent:`);
                console.log(message);
            }
            return message;
        });
    }
};

enum LanguageName {
    node = 'node',
    java = 'java'
}

const baseDir = resolve(dirname(fileURLToPath(import.meta.url)));
const relativeDir = '../../../../../node_modules/pyright/dist/pyright-langserver.js';

const processRunPath = resolve(baseDir, relativeDir);

var languageServerRunConfig = {
    serverName: 'PYRIGHT',
    pathName: '/pyright',
    serverPort: 30001,
    runCommand: LanguageName.node,
    runCommandArgs: [
        processRunPath,
        '--stdio'
    ],
    wsServerOptions: {
        noServer: true,
        perMessageDeflate: false,
        clientTracking: true,
        verifyClient: (
            clientInfo: { origin: string; secure: boolean; req: IncomingMessage },
            callback
        ) => {
            const parsedURL = new URL(`${clientInfo.origin}${clientInfo.req.url ?? ''}`);
            const authToken = parsedURL.searchParams.get('authorization');
            if (authToken === 'UserAuth') {
                callback(true);
            } else {
                callback(false);
            }
        }
    }
}

// create the express application
const app = express();
// server the static content, i.e. index.html
const dir = getLocalDirectory(import.meta.url);
app.use(express.static(dir));
// start the http server
const httpServer: Server = app.listen(languageServerRunConfig.serverPort);
const wss = new WebSocketServer(languageServerRunConfig.wsServerOptions);

httpServer.on('upgrade', (request: IncomingMessage, socket: Socket, head: Buffer) => {
    const baseURL = `http://${request.headers.host}/`;
    const pathName = request.url !== undefined ? new URL(request.url, baseURL).pathname : undefined;
    
    if (pathName === languageServerRunConfig.pathName) {
        wss.handleUpgrade(request, socket, head, webSocket => {
            const socket: IWebSocket = {
                send: content => webSocket.send(content, error => {
                    if (error) {
                        throw error;
                    }
                }),
                onMessage: cb => webSocket.on('message', (data) => {
                    console.log(data.toString());
                    cb(data);
                }),
                onError: cb => webSocket.on('error', cb),
                onClose: cb => webSocket.on('close', cb),
                dispose: () => webSocket.close()
            };
            // launch the server when the web socket is opened
            if (webSocket.readyState === webSocket.OPEN) {
                
                launchLanguageServer(languageServerRunConfig, socket);
            } else {
                webSocket.on('open', () => {
                    launchLanguageServer(languageServerRunConfig, socket);
                });
            }
        });
    }
});


