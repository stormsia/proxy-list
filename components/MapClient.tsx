"use client";

import dynamic from "next/dynamic";
import styles from "@/app/page.module.css";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <div className={styles.mapLoading}>Loading Interactive Map...</div>,
});

export default Map;
