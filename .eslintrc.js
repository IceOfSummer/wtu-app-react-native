module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
      },
    },
  ],
  rules: {
    'no-extra-semi': 'error',
    semi: [2, 'never'],
    'no-undef': 'off',
    quotes: ['error', 'single'],
    'vue/no-v-model-argument': 'off',
    'object-curly-spacing': ['error', 'always'],
    'template-curly-spacing': 'error',
    'space-infix-ops': 'error',
    'space-before-blocks': 'error',
  },
}
