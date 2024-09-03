import * as monaco from 'monaco-editor';

export const registerLanguage = () => {
    monaco.languages.register({
        id: 'lua',
        extensions: ['.lua'],
        aliases: ['Lua', 'lua'],
    });
}
export const createModel = (): monaco.editor.ITextModel => monaco.editor.createModel(
    '',
    'lua',
    monaco.Uri.parse(
        `file:///hello-${Math.random()}.lua`
    )
);