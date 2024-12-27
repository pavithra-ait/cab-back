const jest = {
    preset: "ts-jest",
    testEnvironment: "node",
    transform: {
      "^.+\\.tsx?$": ["ts-jest", { isolatedModules: true }],
      "^.+\\.js$": "babel-jest",
    },
    transformIgnorePatterns: [
      "node_modules/(?!chai)" 
    ],
  };
  
  export default jest;