// eslint.config.js
import eslintPluginTs from "@typescript-eslint/eslint-plugin";
import parserTs from "@typescript-eslint/parser";

export default [
    {
        ignores: ["dist/**", "node_modules/**"], // replaces .eslintignore
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: parserTs,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                project: "./tsconfig.json", // if you use "strict": true
            },
        },
        plugins: {
            "@typescript-eslint": eslintPluginTs,
        },
        rules: {
            // Example rules
            semi: ["error", "always"],
            quotes: ["error", "double"],
            "@typescript-eslint/no-unused-vars": "warn",
        },
    },
];
