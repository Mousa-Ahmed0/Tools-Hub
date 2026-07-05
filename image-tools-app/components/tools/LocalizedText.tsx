"use client";

import { ReactNode } from "react";
import { translateCommonLabel, useI18n } from "@/lib/i18n";

type LocalizedTextProps = {
  children: string;
};

export default function LocalizedText({ children }: LocalizedTextProps) {
  const { t } = useI18n();

  return <>{translateCommonLabel(t, children) ?? children}</>;
}
