"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from "./CodeSnippet.module.css";

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

  return (
    <div className={styles.snippetContainer}>
      <div className={styles.header}>
        <span className={styles.language}>{language}</span>
        <button className={styles.copyButton} onClick={handleCopy}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied" : "Copy Code"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 var(--radius) var(--radius)',
          fontSize: '0.875rem',
          padding: '1.5rem',
          background: 'var(--surface)',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
