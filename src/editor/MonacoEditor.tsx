// Monaco, themed to match the prototype's code panel. Loaded lazily; bundles only the editor core + Python grammar.
import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/edcore.main.js';
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution.js';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker';
import type { EditorProps } from './CodeEditor';

(self as unknown as { MonacoEnvironment: unknown }).MonacoEnvironment = { getWorker: () => new EditorWorker() };

monaco.editor.defineTheme('botanica', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: '', foreground: 'e9e3d3' },
    { token: 'keyword', foreground: 'ec9a8f' },
    { token: 'string', foreground: 'bcd8be' },
    { token: 'number', foreground: 'f0c06a' },
    { token: 'comment', foreground: '8e9584', fontStyle: 'italic' },
    { token: 'delimiter', foreground: 'b7bba9' },
    { token: 'operator', foreground: 'ec9a8f' },
    { token: 'identifier', foreground: 'e9e3d3' },
  ],
  colors: {
    'editor.background': '#171d12',
    'editor.foreground': '#e9e3d3',
    'editorLineNumber.foreground': '#7f8a74',
    'editorLineNumber.activeForeground': '#a3a893',
    'editorCursor.foreground': '#f3c766',
    'editor.selectionBackground': '#b4cfb64d',
    'editor.lineHighlightBackground': '#1b2315',
    'editorIndentGuide.background1': '#232c1c',
    'editorGutter.background': '#171d12',
    'editorWidget.background': '#1b2315',
    'editorWidget.border': '#46553a',
    'scrollbarSlider.background': '#3a473066',
  },
});

export default function MonacoEditor({ value, onChange, onRun, ariaLabel }: EditorProps) {
  const host = useRef<HTMLDivElement>(null);
  const ed = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const latest = useRef({ onChange, onRun });
  latest.current = { onChange, onRun };

  useEffect(() => {
    const e = monaco.editor.create(host.current!, {
      value, language: 'python', theme: 'botanica', ariaLabel,
      fontFamily: "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace", fontSize: 13.5, lineHeight: 22, fontLigatures: false,
      minimap: { enabled: false }, scrollBeyondLastLine: false, automaticLayout: true, tabSize: 4, insertSpaces: true,
      renderLineHighlight: 'line', padding: { top: 14, bottom: 14 }, lineNumbersMinChars: 3, glyphMargin: false, folding: false,
      overviewRulerLanes: 0, hideCursorInOverviewRuler: true, scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
      tabFocusMode: false, accessibilitySupport: 'auto',
    });
    e.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => latest.current.onRun());
    const sub = e.onDidChangeModelContent(() => latest.current.onChange(e.getValue()));
    ed.current = e;
    return () => { sub.dispose(); e.dispose(); ed.current = null; };
  }, []);

  // External value changes (file switch, reset) replace the model text without losing undo on ordinary typing.
  useEffect(() => {
    const e = ed.current;
    if (e && e.getValue() !== value) e.setValue(value);
  }, [value]);

  return <div ref={host} className="ed-monaco" style={{ flex: 1, minHeight: 0, position: 'relative', background: '#171d12' }} />;
}
