import { useEffect, useRef } from 'react';
import JSONEditor from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/zh-cn';

interface JsonEditorProps {
  value: any;
  onChange?: (value: any) => void;
  readOnly?: boolean;
  height?: string;
}

export const JsonEditor = ({
  value,
  onChange,
  readOnly = false,
  height = '300px'
}: JsonEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleChange = (data: any) => {
    if (onChange && !data.error && data.jsObject) {
      onChange(data.jsObject);
    }
  };

  return (
    <div
      ref={containerRef}
      className="json-editor-container border border-border rounded-lg overflow-hidden w-full"
      style={{ height }}
    >
      <JSONEditor
        placeholder={value}
        locale={locale}
        height={height}
        viewOnly={readOnly}
        onChange={handleChange}
        theme="light_mitsuketa_tribute"
        style={{
          body: {
            fontSize: '14px',
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            width: '100%'
          },
          container: {
            backgroundColor: 'hsl(var(--secondary))',
            border: 'none',
            width: '100%'
          },
          outerBox: {
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            width: '100%'
          },
          labelColumn: {
            background: 'hsl(var(--muted))',
          },
          contentBox: {
            backgroundColor: 'hsl(var(--card))',
            width: '100%'
          }
        }}
      />
    </div>
  );
};
