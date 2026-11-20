import { globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  globalIgnores([".next/**", ".next-build/**", "node_modules/**"]),
  {
    files: ["**/*.js", "**/*.ts", "**/*.jsx", "**/*.tsx"],
    rules: {
      "@next/next/no-img-element": "off",
      // Existing data loaders update state only after asynchronous API calls,
      // while the canvas animation reads time only from its animation callback.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
    },
  },
];

export default eslintConfig;
