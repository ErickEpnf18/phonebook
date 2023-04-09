'use strict';

module.exports = {
  // extends: ['plugin:react/recommended', 'airbnb'],
  extends: 'airbnb-base/legacy',
  env: {
    node: true,
    commonjs: true,
    es2021: true
  },
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'max-len': ['error', { code: 103 }],
    'no-param-reassign': [
      'error',
      { props: true, ignorePropertyModificationsFor: ['returnedObject'] }
    ],
    'no-underscore-dangle': ['error', { allow: ['_id', '__v'] }],
    'no-unused-vars': ['error', { args: 'none' }],
    'no-console': ['error', { allow: ['warn', 'error', 'log'] }]

    // indent: ["error", 2],
    // eqeqeq: "error",
    // eqeqeq: "error",
    // "no-trailing-spaces": "error",
    // "object-curly-spacing": ["error", "always"],
    // "arrow-spacing": ["error", { before: true, after: true }],
    // "no-console": 0,
    // semi: ["error", "always"],
    // quotes: ["error", "double"],
  }
};
