import { useRef, useImperativeHandle, forwardRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import type { editor as MonacoEditorType } from 'monaco-editor';
import { useTheme } from '@/contexts/ThemeContext';

export interface JsonEditorProps {
  value: object;
  onChange?: (value: object) => void;
  readOnly?: boolean;
  height?: string;
}

export const JsonEditor = forwardRef<{ getValue: () => object | null }, JsonEditorProps>(
  ({ value, onChange, readOnly = false, height = '400px' }, ref) => {
    const { theme } = useTheme();
    const editorRef = useRef<MonacoEditorType.IStandaloneCodeEditor | null>(null);

    useImperativeHandle(ref, () => ({
      getValue: () => {
        if (editorRef.current) {
          const val = editorRef.current.getValue();
          try {
            return JSON.parse(val);
          } catch (e) {
            console.error('JsonEditor.getValue parse error:', e);
            return null;
          }
        }
        return null;
      },
    }));

    const handleEditorChange = (newValue: string | undefined) => {
      if (newValue === undefined) return;
      try {
        const obj = JSON.parse(newValue);
        onChange?.(obj);
      } catch (e) {
        // Invalid JSON, do not trigger onChange
      }
    };

    const handleEditorDidMount: OnMount = (editor) => {
      editorRef.current = editor;
    };

    return (
      <Editor
        height={height}
        language="json"
        value={JSON.stringify(value, null, 2)}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={theme === 'dark' ? 'vs-dark' : 'vs'}
      />
    );
  }
);
