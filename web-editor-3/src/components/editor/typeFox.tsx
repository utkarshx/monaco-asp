import * as vscode from 'vscode'
import {
  RegisteredFileSystemProvider,
  registerFileSystemOverlay,
  RegisteredMemoryFile,
} from '@codingame/monaco-vscode-files-service-override'
import React, { StrictMode } from 'react'
import type { TextChanges } from '@typefox/monaco-editor-react'
import { MonacoEditorReactComp } from '@typefox/monaco-editor-react'
import { useWorkerFactory } from 'monaco-editor-wrapper/workerFactory'
import { MonacoEditorLanguageClientWrapper } from 'monaco-editor-wrapper'
import { createUserConfig } from './config'

const ReactPythonEditor: React.FC = () => {
  useWorkerFactory({
    ignoreMapping: true,
    workerLoaders: {
      editorWorkerService: () =>
        new Worker(
          new URL(
            'monaco-editor/esm/vs/editor/editor.worker.js',
            import.meta.url,
          ),
          { type: 'module' },
        ),
    },
  })
  const badPyCode = `def main():
    return pass`
  const badPyUri = vscode.Uri.file('/workspace/bad.py')
  const fileSystemProvider = new RegisteredFileSystemProvider(false)
  fileSystemProvider.registerFile(new RegisteredMemoryFile(badPyUri, badPyCode))
  registerFileSystemOverlay(1, fileSystemProvider)

  const onTextChanged = (textChanges: TextChanges) => {
    console.log(
      `Dirty? ${textChanges.isDirty}\ntext: ${textChanges.main}\ntextOriginal: ${textChanges.original}`,
    )
  }

  return (
    <div style={{ height: '80vh', padding: '5px' }}>
      <MonacoEditorReactComp
        userConfig={createUserConfig(
          '/workspace',
          badPyCode,
          '/workspace/bad.py',
        )}
        style={{ height: '100%' }}
        onTextChanged={onTextChanged}
        onLoad={(wrapper: MonacoEditorLanguageClientWrapper) => {
          console.log(`Loaded ${wrapper.reportStatus().join('\n').toString()}`)
        }}
        onError={(e) => {
          console.error(e)
        }}
      />
    </div>
  )
}

export default ReactPythonEditor
