import { Editor, Monaco } from '@monaco-editor/react'
import './App.css'
import { createModel, registerLanguage } from './ws/utils';
import { connectToLs } from './ws/wsclient';

function App() {
  const editorDidMount= (editor,monaco) => {
      const model = createModel(monaco);
      editor.setModel(model);
      connectToLs();
      editor.focus();
  };

  const beforeMount = (monaco: Monaco) => {
    monaco.languages.register({
      id: 'lua',
      extensions: ['.lua'],
      aliases: ['Lua', 'lua'],
    });
  }


  return (
    <>
      <Editor
        height="90vh"
        defaultLanguage="lua"
        defaultValue="// some comment"
        onMount={editorDidMount}
        beforeMount={(monaco: Monaco) => beforeMount(monaco)}
      />
      ;
    </>
  )
}

export default App
