module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parser: 'vue-eslint-parser',
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:vue/base',
    'plugin:nuxt/recommended',
    'airbnb-typescript/base',
  ],
  parserOptions: {
    project: './tsconfig.json',
    extraFileExtensions: ['.vue', '.html'],
  },
  rules: {
    '@typescript-eslint/camelcase': 'off',
    'no-multiple-empty-lines': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'no-shadow': ['error', { 'allow': ['state'] }],
    'no-param-reassign': ['error', { 'props': true, 'ignorePropertyModificationsFor': ['state'] }],
    'no-restricted-syntax': [
      'warn',
      {
        'selector': ':not(BinaryExpression:matches([operator="!=="], [operator="==="])) > Literal[value=null]',
        'message': 'Usage of "null" is deprecated except when received from legacy APIs; use "undefined" instead'
      },
    ],
    'max-len': ['error', 110, 2, {
      'ignorePattern': '(^import\\s.+\\sfrom\\s.+;)|(^\\s+@apply\\s.*;)$',
      'ignoreUrls': true
    }],
  }
}
