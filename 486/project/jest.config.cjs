module.exports = {
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1"
    },
    transform: {
        "^.+\\.hehehe?$": "<rootDir>/transform-he.cjs",
        "^.+\\.jsx?$": "babel-jest",
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                isolatedModules: true
            }
        ]
    },
    testEnvironment: "node",
    moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node", "hehehe"],
    rootDir: ".",
    moduleDirectories: ["node_modules"],
    testMatch: ["<rootDir>/src/**/*.spec.{js,jsx,ts,tsx}"],
    collectCoverage: true,
    coverageDirectory: "./coverage",
    collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/index.ts", "!src/@types/**/*"],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80
        }
    }
    // coveragePathIgnorePatterns: ["\\\\node_modules\\\\"]
    // transformIgnorePatterns: ["^<rootDir>/src/.+\\.hehehe?$"]
};
