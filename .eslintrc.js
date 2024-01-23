module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict',
    'plugin:@typescript-eslint/stylistic',
    'plugin:import/recommended',
    'plugin:import/typescript',
    '@react-native',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'import', 'jest'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    project: ['./tsconfig.json'],
  },
  // Ignore ESlint config to fix that issue – https://typescript-eslint.io/linting/troubleshooting/#i-get-errors-telling-me-eslint-was-configured-to-run--however-that-tsconfig-does-not--none-of-those-tsconfigs-include-this-file
  ignorePatterns: ['/.eslintrc.js'],
  settings: {
    'import/ignore': ['react-native'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: true,
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  env: {
    'jest/globals': true,
  },
  rules: {
    // react-native
    'react-native/sort-styles': [2, 'asc'],
    // react
    'react-hooks/rules-of-hooks': 2,
    'react-hooks/exhaustive-deps': 1,
    'react/jsx-sort-props': [
      2,
      {
        reservedFirst: ['key', 'ref'],
        shorthandFirst: true,
        callbacksLast: true,
      },
    ],
    'sort-imports': [
      2,
      {
        memberSyntaxSortOrder: ['single', 'all', 'multiple', 'none'],
        ignoreDeclarationSort: true,
      },
    ],
    // import
    'import/no-cycle': 1,
    'import/no-unresolved': [2, { ignore: ['^AppTypes/'] }],
    'import/newline-after-import': 2,
    'import/first': 2,
    'import/order': [
      2,
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
        ],
        pathGroups: [
          {
            pattern: '~/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'react-native',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react-native', 'react'],
      },
    ],
    // other
    'no-console': 1,
    'vars-on-top': 2,
    'no-duplicate-imports': 2,
    'object-curly-newline': [
      2,
      {
        ObjectExpression: {
          multiline: true,
          minProperties: 4,
          consistent: true,
        },
        ObjectPattern: { multiline: true, minProperties: 4, consistent: true },
      },
    ],
    'space-before-blocks': 2,
    'sort-keys': [2, 'asc', { allowLineSeparatedGroups: true }],
    'require-await': 2,
    'padding-line-between-statements': 0,
    '@typescript-eslint/padding-line-between-statements': [
      2,
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
      {
        blankLine: 'always',
        prev: ['interface', 'type'],
        next: '*',
      },
      {
        blankLine: 'any',
        prev: ['interface', 'type'],
        next: ['interface', 'type'],
      },
    ],
    '@typescript-eslint/consistent-type-definitions': [2, 'type'],
    '@typescript-eslint/consistent-type-imports': [
      2,
      {
        fixStyle: 'inline-type-imports',
        prefer: 'type-imports',
      },
    ],
    '@typescript-eslint/member-ordering': [
      2,
      {
        interfaces: {
          optionalityOrder: 'optional-first',
          order: 'natural-case-insensitive',
          memberTypes: ['signature', 'method', 'constructor', 'field'],
        },
        typeLiterals: {
          optionalityOrder: 'optional-first',
          order: 'natural-case-insensitive',
          memberTypes: ['signature', 'method', 'constructor', 'field'],
        },
      },
    ],
    '@typescript-eslint/naming-convention': [
      2,
      // Enforce that all variables and properties follow are strictCamelCase or StrictPascalCase
      {
        selector: 'variableLike',
        format: ['strictCamelCase', 'StrictPascalCase'],
      },
      // Enforce that boolean variables are prefixed with an allowed verb
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['PascalCase'],
        prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
      },
      // Enforce that interface names do not begin with an I
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: false,
        },
      },
      // Enforce that type parameters (generics) are prefixed with T
      {
        selector: 'typeParameter',
        format: ['PascalCase'],
        prefix: ['T'],
      },
    ],
  },
};
