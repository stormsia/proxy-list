import React from "react";
import styles from "./FAQ.module.css";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

export default function FAQ({ items, title = "Frequently Asked Questions" }: FAQProps) {
  if (!items || items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className={styles.faqSection} aria-label={title}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.grid}>
        {items.map((item, index) => (
          <div key={index} className={styles.card}>
            <h3 className={styles.question}>{item.question}</h3>
            <p className={styles.answer}>{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
