// import React, { useState, useEffect } from "react";
// import Editor, { OnMount } from "@monaco-editor/react"; // Import the Editor component
// import { connectToLs } from "../ls-client/ws-client";
// import { HELLO_LANG_ID, MONACO_OPTIONS } from "./constants";
// import { createModel, registerLanguage } from "./util";
// import * as monaco from 'monaco-editor'; 

// export function EditorComponent() {
//     const [isEditorReady, setIsEditorReady] = useState(false);

//     const handleEditorDidMount: OnMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
//         setIsEditorReady(true);
//         registerLanguage();
//         //  createModel();
//         //editor.setModel(model);
//         connectToLs();
//         editor.focus();
//     };
//     return (
//         <div>
//             <div>
//                 <h3>Web Editor</h3>
//             </div>
//             <div>
//                 <Editor
//                     height="80vh" // Set the height directly
//                     defaultLanguage={HELLO_LANG_ID}
//                     defaultValue="// type your code here"
//                     theme="vs-dark"
//                     options={MONACO_OPTIONS}
//                     onMount={handleEditorDidMount}
//                 />
//             </div>
//         </div>
//     );
// }
