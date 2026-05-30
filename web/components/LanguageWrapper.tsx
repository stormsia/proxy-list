"use client";

import { usePathname } from "next/navigation";

export default function LanguageWrapper({
  en,
  ru
}: {
  en: React.ReactNode;
  ru: React.ReactNode;
}) {
  const pathname = usePathname();
  const isRu = pathname?.startsWith("/ru") || pathname?.startsWith("/proxy-list/ru");
  
  return <>{isRu ? ru : en}</>;
}
