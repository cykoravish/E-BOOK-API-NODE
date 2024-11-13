// eslint-disable-next-line no-undef
module.exports = {
  apps: [
      {
          name: "elib-backend-app",
          script: "./dist/server.js",
          instances: 1,
          exec_mode: "fork",
          env: {
              NODE_ENV: "development",
          },
          env_production: {
              NODE_ENV: "production",
          },
      },
  ],
};
