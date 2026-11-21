"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import go from "react-syntax-highlighter/dist/esm/languages/prism/go";
import http from "react-syntax-highlighter/dist/esm/languages/prism/http";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./CodeSnippet.module.css";

// Register lightweight grammars only — shrinks bundle from 640KB to < 30KB
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("go", go);
SyntaxHighlighter.registerLanguage("http", http);

interface CodeSnippetProps {
  language: string;
  code: string;
}

export default function CodeSnippet({ language, code }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const normalizedLang = language.toLowerCase();

  return (
    <div className={styles.snippetContainer}>
      <div className={styles.header}>
        <span className={styles.language}>{language}</span>
        <button
          type="button"
          className={`${styles.copyButton} ${copied ? styles.copyButtonSuccess : ""}`}
          onClick={handleCopy}
          aria-label={copied ? "Copied code" : "Copy code snippet"}
        >
          {copied ? <Check size={14} className={styles.iconSuccess} /> : <Copy size={14} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <div className={styles.codeWrapper}>
        <SyntaxHighlighter
          language={normalizedLang}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: "0 0 var(--radius-lg) var(--radius-lg)",
            fontSize: "0.875rem",
            padding: "1.25rem 1.5rem",
            background: "var(--bg-surface)",
            lineHeight: 1.65,
            fontFamily: "var(--font-mono)",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
