module.exports = {
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest"
    },
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        axios: 'axios/dist/node/axios.cjs'
    },
    transformIgnorePatterns: [
        "/node_modules/(?!axios).*",
        "/node_modules/(?!react-bootstrap)"
    ],
    setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect", "<rootDir>/src/setupTests.js"],
    testPathIgnorePatterns: ["/node_modules/"]
};