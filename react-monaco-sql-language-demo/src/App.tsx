import Editor, { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
// import MonacoEditor from "react-monaco-editor";

// 导入monaco-editor的语言支持
loader.config({ monaco })

function App() {
  // return <MonacoEditor height={600} language="mysql" theme="vs-dark" />;
  return <Editor height={600} language="mysql" theme="vs-dark" />
}

export default App
