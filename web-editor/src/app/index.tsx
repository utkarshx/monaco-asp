import React, { useEffect } from "react";

import { Editor } from "../components/editor";

export function App() {
    useEffect(() => {
        console.log("App component mounted");
    }, []);

    return (
        <div>
            <Editor />
        </div>
    );
}
