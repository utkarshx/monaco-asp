import * as monaco from 'monaco-editor';
import { HELLO_LANG_EXTENSION, HELLO_LANG_ID } from "./constants"
import { initServices } from 'monaco-languageclient/vscode/services';

// import getThemeServiceOverride from '@codingame/monaco-vscode-theme-service-override';
// import getTextmateServiceOverride from '@codingame/monaco-vscode-textmate-service-override';

export const registerLanguage = async() => {
    await initServices({
        serviceConfig: {
            userServices: {
                // ...getThemeServiceOverride(),
                // ...getTextmateServiceOverride(),
            },
            debugLogging: true,
        }
    });
    // monaco.languages.register({
    //     id: HELLO_LANG_ID,
    //     aliases: [HELLO_LANG_ID],
    //     extensions: [HELLO_LANG_EXTENSION]
    // });
    monaco.languages.register({
        id: 'typescript',
        extensions: ['.ts', '.tsx'],
        aliases: ['TypeScript', 'ts', 'typescript']
    });
}

export const createModel = (): monaco.editor.ITextModel => monaco.editor.createModel(
    '',
    HELLO_LANG_ID,
    monaco.Uri.parse(
        `file:///hello-${Math.random()}${HELLO_LANG_EXTENSION}`
    )
);

export const configureMonacoWorkers = () => {
    (self as any).MonacoEnvironment = {
        getWorkerUrl: function (_moduleId: any, label: string) {
            if (label === 'typescript' || label === 'javascript') {
                return './ts.worker.bundle.js';
            }
            return './editor.worker.bundle.js';
        }
    };
};