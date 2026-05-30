"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export default function ClarityInitializer() {
  useEffect(() => {
    Clarity.init("wz3d0xan93");
  }, []);

  return null;
}
