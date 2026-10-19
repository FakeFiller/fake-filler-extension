import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**", "test_pages/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.webextensions },
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": { typescript: true, node: true },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      // TypeScript already checks component props.
      "react/prop-types": "off",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "parent", "sibling", "index"],
          "newlines-between": "always-and-inside-groups",
          alphabetize: { order: "asc", caseInsensitive: false },
        },
      ],
    },
  },
  prettierRecommended
);
