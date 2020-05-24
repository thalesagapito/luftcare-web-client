// Config file used by the apollo extension on Vscode
module.exports = {
  client: {
    service: {
      name: 'luftcare-api',
      url: 'http://localhost:5000',
    },
    // Files processed by the extension
    includes: [
      './graphql/**/*.ts',
      './pages/**/*.vue',
    ],
  },
};
