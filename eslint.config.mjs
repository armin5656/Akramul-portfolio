import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { globalIgnores } from "eslint/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  globalIgnores([".next/**", ".next-build/**", "node_modules/**"]),
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 👉 Custom rule override block
  {
    files: ["**/*.js", "**/*.ts", "**/*.jsx", "**/*.tsx"],
    rules: {
      "@next/next/no-img-element": "off", // disable image enforcement
    },
  },
];

export default eslintConfig;
