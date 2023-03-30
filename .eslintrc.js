module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "no-shadow": "warn",
    "no-unused-vars": "warn",
    "react/function-component-definition": "off",
    "react/jsx-no-bind": "off",
    "react/react-in-jsx-scope": "off",
  },
};
