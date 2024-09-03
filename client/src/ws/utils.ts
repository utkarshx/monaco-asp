export const createModel = (monaco) => {
    const model = monaco.editor.createModel(
        '',
        'lua',
        monaco.Uri.parse(
            `file:///hello-${Math.random()}.lua`
        )
    )
    return model;
}