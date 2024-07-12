module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint/eslint-plugin"],
    env: {
        es6: true,
        jest: true,
        node: true,
        browser: true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:jest-formatting/recommended"
        // "plugin:prettier/recommended"
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
            jsx: true
        }
    },
    rules: {
        indent: ["warn", 2, { SwitchCase: 1 }],
        quotes: ["warn", "single", "avoid-escape"]
    },
    // rules: {
    //     indent: ["warn", 2, { SwitchCase: 1 }],
    //     quotes: ["error", "single", "avoid-escape"],
    //     "prettier/prettier": [
    //         "warn",
    //         {
    //             singleQuote: true,
    //             tabWidth: 2
    //         }
    //     ]
    // },
    overrides: [
        {
            files: ["**/*.json", "**/*.hehehe"],
            rules: {
                quotes: ["error", "single"]
            }
        },
        {
            files: ["**/*.ts", "**/*.tsx"],
            rules: {
                "@typescript-eslint/explicit-function-return-type": "error",
                quotes: ["error", "single", "avoid-escape"],
                indent: [
                    "warn",
                    2,
                    {
                        ignoredNodes: ["CallExpression.arguments BlockStatement.body CallExpression"]
                        // FunctionExpression: { parameters: "first", body: 2 }
                        // outerIIFEBody: 1
                    }
                ]
            }
        },
        {
            files: ["**/*.js", "**/*.jsx", "**/*.cjs"],
            rules: {
                "@typescript-eslint/no-var-requires": 0,
                "@typescript-eslint/explicit-module-boundary-types": 0
            }
        }
    ]
};
