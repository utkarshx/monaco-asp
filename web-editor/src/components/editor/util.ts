import * as monaco from 'monaco-editor';
import { HELLO_LANG_EXTENSION, HELLO_LANG_ID } from "./constants"
import { initServices } from 'monaco-languageclient/vscode/services';

let isServicesInitialized = false;

export const registerLanguage = async () => {
    if (!isServicesInitialized) {
        try {
            await initServices({
                serviceConfig: {
                    userServices: {},
                    debugLogging: true,
                }
            });
            isServicesInitialized = true;
        } catch (error) {
            console.warn('Services initialization failed:', error);
            // Proceed even if initialization fails
        }
    }

    // Avoid duplicate language registration
    if (!monaco.languages.getLanguages().some(lang => lang.id === HELLO_LANG_ID)) {
        monaco.languages.register({
            id: HELLO_LANG_ID,
            aliases: [HELLO_LANG_ID],
            extensions: [HELLO_LANG_EXTENSION]
        });
    }
}

const value = `{
    "$schema": "http://json.schemastore.org/coffeelint",
    "line_endings": "unix"
}`;
export const createModel = (): monaco.editor.ITextModel => monaco.editor.createModel(
    value,
    HELLO_LANG_ID,
    monaco.Uri.parse(
        `file:///hello-${Math.random()}${HELLO_LANG_EXTENSION}`
    )
);
