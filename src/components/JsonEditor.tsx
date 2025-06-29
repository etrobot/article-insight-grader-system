import { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
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
    const [internalValue, setInternalValue] = useState(JSON.stringify(value, null, 2));

    useEffect(() => {
      setInternalValue(JSON.stringify(value, null, 2));
    }, [value]);

    useImperativeHandle(ref, () => ({
      getValue: () => {
        try {
          return JSON.parse(internalValue);
        } catch (e) {
          console.error('JsonEditor.getValue parse error:', e);
          return null;
        }
      },
    }));

    const handleEditorChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value;
      setInternalValue(newValue);
      try {
        const obj = JSON.parse(newValue);
        onChange?.(obj);
      } catch (e) {
        // Invalid JSON, do not trigger onChange
      }
    };

    const textAreaStyle: React.CSSProperties = {
      width: '100%',
      height: height,
      fontFamily: 'monospace',
      fontSize: '14px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '10px',
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
      color: theme === 'dark' ? '#d4d4d4' : '#000000',
      resize: 'vertical',
    };

    return (
      <textarea
        style={textAreaStyle}
        value={internalValue}
        onChange={handleEditorChange}
        readOnly={readOnly}
        data-testid="json-editor-textarea"
      />
    );
  }
);