import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["**/node_modules"]), {
    extends: compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:jsx-a11y/recommended",
        "eslint-config-preact",
    ),

    plugins: {
        "@typescript-eslint": typescriptEslint,
        "jsx-a11y": jsxA11Y,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: "script",

        parserOptions: {
            jsx: true,
        },
    },

    rules: {
        "no-console": "error",
        quotes: ["error", "double"],
        indent: ["error", 2],
        "react/jsx-no-bind": "off",
        "comma-dangle": "off",
        "react/jsx-indent-props": ["error", 2],
        "jsx-a11y/label-has-associated-control": ["off"],
    },
}]);