import MonacoEditor, { EditorDidMount } from "react-monaco-editor";
import { connectToLs } from "../ls-client/ws-client";
import { MONACO_OPTIONS } from "./constants";
import { createModel, registerLanguage } from "./util";
export function Editor() {
    const editorDidMount: EditorDidMount = (editor) => {
        registerLanguage();
        const model = createModel();
        editor.setModel(model);
        connectToLs();
        editor.focus();
    };

    return (
        <div>
            <div>
                <h3>Web Editor</h3>
            </div>
            <div>
                <MonacoEditor
                    width="100%"
                    height="80vh"
                    // language="lua"
                    language="typescript"
                    theme="vs"
                    options={MONACO_OPTIONS}
                    editorDidMount={editorDidMount}
                />
            </div>
        </div>
    );
}
