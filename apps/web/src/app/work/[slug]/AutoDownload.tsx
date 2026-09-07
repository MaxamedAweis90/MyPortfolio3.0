"use client";

import { useEffect } from "react";

type AutoDownloadProps = {
  shouldDownload: boolean;
  apkUrl?: string;
};

const AutoDownload = ({ shouldDownload, apkUrl }: AutoDownloadProps) => {
  useEffect(() => {
    if (!shouldDownload || !apkUrl) return;
    window.location.href = apkUrl;
  }, [shouldDownload, apkUrl]);

  return null;
};

export default AutoDownload;
