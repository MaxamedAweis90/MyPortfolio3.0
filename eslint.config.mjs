import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "src/sanity/myportfolio/dist/**",
      "src/sanity/myportfolio/static/**",
      "src/sanity/myportfolio/script/**",
      "src/sanity/myportfolio/**/vendor/**",
    ],
  },
  ...compat.extends("next/core-web-vitals"),
];

export default eslintConfig;
