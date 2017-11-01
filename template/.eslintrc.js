module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "node": true,
    "es6": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/recommended"
  ],
  "parserOptions": {
    "parser": "babel-eslint",
    "sourceType": "module"
  },
  "plugins": [
    "vue"
  ],
  "rules": {
    "indent": [ "error", 2, {
      "SwitchCase": 1
    } ],
    // "linebreak-style": [ "error", "unix" ],
    "eol-last": [ "error", "always" ],
    "quotes": [ "error", "single" ],
    "no-extra-parens": [ "error" ],
    "no-unsafe-negation": [ "error" ],
    "no-alert": [ "warn" ],
    "no-console": [ "warn" ],
    "semi": [ "error", "always" ],
    "camelcase": [ "error", { "properties": "never" } ],
    "dot-notation": [ "error" ],
    "comma-dangle": [ "error", "never" ],
    "no-multiple-empty-lines": [ "error", { "max": 1 } ],
    "no-multi-spaces": [ "error" ],
    "vars-on-top": [ "error" ],
    "func-call-spacing": [ "error", "never" ],
    "block-spacing": [ "error", "always" ],
    "space-in-parens": [ "error", "never" ],
    "space-before-function-paren": [ "error", "never" ],
    "array-bracket-spacing": [ "error", "always" ],
    "key-spacing": [ "error" ]
  }
};
