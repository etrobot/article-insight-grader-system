import { useRef, useImperativeHandle, forwardRef } from 'react';
import MonacoEditor, { Monaco } from 'react-monaco-editor';

export interface JsonEditorProps {
  value: object;
  onChange?: (value: object) => void;
  readOnly?: boolean;
  height?: string;
}

export const JsonEditor = forwardRef<{ getValue: () => object | null }, JsonEditorProps>(
  ({ value, onChange, readOnly = false, height = '400px' }, ref) => {
    const editorRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      getValue: () => {
        if (editorRef.current) {
          try {
            return JSON.parse(editorRef.current.getValue());
          } catch {
            return null;
          }
        }
        return null;
      }
    }));

    const handleEditorChange = (newValue: string) => {
      try {
        const obj = JSON.parse(newValue);
        onChange?.(obj);
      } catch {
        // 不合法时不触发onChange
      }
    };

    return (
      <MonacoEditor
        ref={editorRef}
        language="json"
        value={JSON.stringify(value, null, 2)}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        height={height}
        onChange={handleEditorChange}
        theme="vs"
      />
    );
  }
);
