"use client";

import dynamic from "next/dynamic";
import styles from "./Map.module.css";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className={styles.mapPlaceholder} aria-busy="true" aria-label="Loading Interactive Map">
      <span>Loading Interactive Map...</span>
    </div>
  ),
});

export default Map;
