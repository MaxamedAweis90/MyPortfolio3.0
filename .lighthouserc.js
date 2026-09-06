// Ensure Windows System32 is in PATH so taskkill and cmd utilities can terminate Chrome cleanly
if (process.platform === "win32") {
  const winDir = process.env.SystemRoot || "C:\\Windows";
  const sys32 = `${winDir}\\System32`;
  if (!process.env.PATH?.toLowerCase().includes("system32")) {
    process.env.PATH = `${sys32};${winDir};${process.env.PATH || ""}`;
  }
}

module.exports = {
  ci: {
    collect: {
      // Start the optimized production server before auditing
      startServerCommand: "npm run start",
      startServerReadyPattern: "started server on|Ready in|Listening on",
      startServerReadyTimeout: 60000,
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/work",
        "http://localhost:3000/experience",
      ],
      numberOfRuns: 1,
      settings: {
        chromeFlags: "--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage",
        throttlingMethod: "simulate",
        screenEmulation: {
          mobile: true,
          width: 412,
          height: 823,
          deviceScaleFactor: 2.625,
          disabled: false,
        },
        formFactor: "mobile",
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          requestLatencyMs: 562.5,
          downloadThroughputKbps: 1474.56,
          uploadThroughputKbps: 675,
          cpuSlowdownMultiplier: 4,
        },
        skipAudits: ["uses-http2"],
      },
    },
    assert: {
      assertions: {
        // Category thresholds
        "categories:performance": ["warn", { minScore: 0.70 }],
        "categories:accessibility": ["error", { minScore: 0.90 }],
        "categories:best-practices": ["warn", { minScore: 0.85 }],
        "categories:seo": ["error", { minScore: 0.90 }],

        // Core Web Vitals targets
        "first-contentful-paint": ["warn", { maxNumericValue: 2500 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 3500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["warn", { maxNumericValue: 500 }],

        // Suppress localhost-only environment warnings
        "errors-in-console": "off",
        "unused-javascript": "off",
        "unused-css-rules": "off",
        "uses-responsive-images": "warn",
        "image-delivery-insight": "warn",
        "network-dependency-tree-insight": "off",
        "legacy-javascript-insight": "off",
        "color-contrast": "warn",
        "label-content-name-mismatch": "warn",
        "heading-order": "warn",
        "bf-cache": "off",
        "document-latency-insight": "warn",
        "forced-reflow-insight": "off",
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "./lighthouse-report",
      reportFilenamePattern: "%%PATHNAME%%-%%DATETIME%%.report.%%EXTENSION%%",
    },
  },
};
