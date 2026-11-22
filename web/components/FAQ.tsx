"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
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
  // First item open by default for discovery
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set([0]));

  if (!items || items.length === 0) return null;

  const toggleItem = (index: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

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
      <div className={styles.accordionList}>
        {items.map((item, index) => {
          const isOpen = openIndices.has(index);
          const buttonId = `faq-btn-${index}`;
          const contentId = `faq-panel-${index}`;

          return (
            <div key={index} className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}>
              <h3 className={styles.questionHeading}>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  className={styles.questionButton}
                  onClick={() => toggleItem(index)}
                >
                  <span className={styles.questionText}>{item.question}</span>
                  <ChevronDown
                    className={`${styles.chevron} ${isOpen ? styles.chevronRotated : ""}`}
                    size={18}
                    aria-hidden="true"
                  />
                </button>
              </h3>
              <div
                id={contentId}
                role="region"
                aria-labelledby={buttonId}
                className={`${styles.answerWrapper} ${isOpen ? styles.answerOpen : ""}`}
              >
                <div className={styles.answerInner}>
                  <p className={styles.answerText}>{item.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
