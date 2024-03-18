module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict',
    'plugin:@typescript-eslint/stylistic',
    'plugin:import/recommended',
    'plugin:import/typescript',
    '@react-native',
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'import', 'sort-destructure-keys'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    project: ['./tsconfig.json', './tsconfig.spec.json'],
    tsconfigRootDir: __dirname,
  },
  // Ignore ESlint config to fix that issue – https://typescript-eslint.io/linting/troubleshooting/#i-get-errors-telling-me-eslint-was-configured-to-run--however-that-tsconfig-does-not--none-of-those-tsconfigs-include-this-file
  ignorePatterns: ['/.eslintrc.js', '/babel.config.js'],
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
  env: {},
  overrides: [
    {
      files: [
        '**/__tests__/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[jt]s?(x)',
        'setup-jest.js',
      ],
      plugins: ['jest', 'jest-extended', 'testing-library'],
      extends: [
        'plugin:jest/recommended',
        'plugin:jest-extended/all',
        'plugin:testing-library/react',
      ],
      env: {
        'jest/globals': true,
      },
    },
  ],
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
    'import/no-unresolved': [
      2,
      {
        ignore: ['@env$'],
      },
    ],
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
    'no-catch-shadow': 0,
    'no-console': 1,
    'vars-on-top': 2,
    'no-duplicate-imports': 2,
    'space-before-blocks': 2,
    'sort-keys': [2, 'asc', { allowLineSeparatedGroups: true }],
    'sort-destructure-keys/sort-destructure-keys': 2,
    'require-await': 2,
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 2,
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
      {
        blankLine: 'always',
        prev: '*',
        next: 'export',
      },
      {
        blankLine: 'any',
        prev: 'export',
        next: 'export',
      },
      {
        blankLine: 'always',
        prev: 'block',
        next: '*',
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
        leadingUnderscore: 'allow',
      },
      {
        selector: 'variable',
        modifiers: ['global'],
        format: ['UPPER_CASE', 'strictCamelCase', 'StrictPascalCase'],
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
    '@typescript-eslint/no-explicit-any': [2, { ignoreRestArgs: true }],
  },
};
