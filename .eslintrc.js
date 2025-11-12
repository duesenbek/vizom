module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Handle Tailwind @apply directives
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen']
      }
    ],
    // Allow console logs in development
    'no-console': 'warn',
    // Handle TypeScript-like JSDoc comments in JS files
    'no-undef': 'off',
    // Allow redeclaration in specific cases
    'no-redeclare': 'warn'
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        // Specific rules for JavaScript files
        '@typescript-eslint/no-redeclare': 'off'
      }
    }
  ],
  ignorePatterns: [
    'dist/',
    'build/',
    'node_modules/',
    '*.min.js'
  ]
};
