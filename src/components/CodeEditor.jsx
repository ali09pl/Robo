import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

export const CodeEditor = ({ value, onChange, language = 'python', height = '400px' }) => {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorInstanceRef.current = monaco.editor.create(editorRef.current, {
        value: value,
        language: language,
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: 'Fira Code, Courier New',
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        formatOnPaste: true,
        formatOnType: true,
        suggestOnTriggerCharacters: true,
        quickSuggestions: {
          other: true,
          comments: false,
          strings: false,
        },
        tabSize: 4,
        insertSpaces: true,
      });

      editorInstanceRef.current.onDidChangeModelContent(() => {
        onChange(editorInstanceRef.current.getValue());
      });

      return () => {
        editorInstanceRef.current?.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (editorInstanceRef.current && value !== editorInstanceRef.current.getValue()) {
      editorInstanceRef.current.setValue(value);
    }
  }, [value]);

  return (
    <div
      ref={editorRef}
      style={{ height, width: '100%' }}
      className="rounded-lg overflow-hidden border border-gray-700"
    />
  );
};
