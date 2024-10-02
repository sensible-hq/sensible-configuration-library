import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.node } },
  {
    plugins: {
      eslintPluginPrettier
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
