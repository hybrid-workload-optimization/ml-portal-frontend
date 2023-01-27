module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "@vue/airbnb", "@vue/prettier"],
  rules: {
    "no-console": "off",
    quotes: ["error", "single"],
    "vue/multi-word-component-names": "off",
    "import/extensions": "off", // 임시 off
    "import/prefer-default-export": "off",
    // "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    // "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
    "vue/require-valid-default-prop": "off",
    "no-restricted-syntax": "off",
    "no-prototype-builtins": "off",
    "no-param-reassign": "off",
    "no-unused-expressions": [
      "error",
      { allowShortCircuit: true, allowTernary: true },
    ],
    "prettier/prettier": [
      "error",
      {
        singleQuote: true,
        semi: false,
        useTabs: false,
        tabWidth: 2,
        trailingComma: "all",
        printWidth: 80,
        bracketSpacing: true,
        arrowParens: "avoid",
        endOfLine: "auto",
      },
    ],
    "import/no-cycle": [2, { maxDepth: 3 }],
  },
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  overrides: [],
};
