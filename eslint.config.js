import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import preferArrow from "eslint-plugin-prefer-arrow";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat["jsx-runtime"],
    ],
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      react,
      import: importPlugin,
      "jsx-a11y": jsxA11y,
      "prefer-arrow": preferArrow,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // React-specific rules
      "react/react-in-jsx-scope": "off", // Not needed with new JSX transform
      "react/prop-types": "off", // Using TypeScript for prop validation
      "react/display-name": "warn",
      "react/no-unused-prop-types": "error",
      "react/no-unused-state": "error",
      "react/prefer-stateless-function": "error",
      "react/self-closing-comp": "error",
      "react/sort-comp": "error",
      "react/jsx-boolean-value": ["error", "never"],
      "react/jsx-curly-brace-presence": ["error", "never"],
      "react/jsx-fragments": ["error", "syntax"],
      "react/jsx-no-useless-fragment": "error",
      "react/jsx-sort-props": ["error", { callbacksLast: true }],

      // React Hooks rules
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",

      // Import/Export rules
      "import/no-unresolved": "error",
      "import/no-unused-modules": "error",
      "import/no-duplicates": "error",
      "import/newline-after-import": "error",
      "import/no-named-as-default": "error",

      // Accessibility rules
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-has-content": "error",
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/no-static-element-interactions": "error",
      "jsx-a11y/role-has-required-aria-props": "error",

      // Arrow function preference
      "prefer-arrow/prefer-arrow-functions": [
        "error",
        {
          disallowPrototype: true,
          singleReturnOnly: false,
          classPropertiesAllowed: false,
        },
      ],

      // TypeScript-specific rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/prefer-enum-initializers": "off",
      "@typescript-eslint/prefer-literal-enum-member": "off",
      "no-restricted-syntax": [
        "error",
        {
          selector: "TSEnumDeclaration",
          message:
            "Enums are not allowed. Use const assertion or union types instead.",
        },
      ],

      // General code quality rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-alert": "error",
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "error",
      "arrow-body-style": ["error", "as-needed"],
      "object-shorthand": "error",
      "prefer-template": "error",

      // Performance and best practices
      "no-nested-ternary": "error",
      "no-unneeded-ternary": "error",
      "prefer-destructuring": [
        "error",
        {
          array: true,
          object: true,
        },
        {
          enforceForRenamedProperties: false,
        },
      ],

      // Security
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",

      // Naming conventions
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "interface",
          format: ["PascalCase"],
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"],
        },
        {
          selector: "class",
          format: ["PascalCase"],
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "variable",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
        },
      ],
    },
  },
);
