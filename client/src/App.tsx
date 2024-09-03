import { Editor } from '@monaco-editor/react'
import './App.css'
import { createModel, registerLanguage } from './ws/utils';
import { connectToLs } from './ws/wsclient';

function App() {
  const editorDidMount= (editor,monaco) => {
    registerLanguage();
    const model = createModel();
    editor.setModel(model);
    connectToLs();
    editor.focus();
};
  return (
    <>
      <Editor
        height="90vh"
        defaultLanguage="lua"
        defaultValue="// some comment"
        onMount={editorDidMount}
      />
      ;
    </>
  )
}

export default App
