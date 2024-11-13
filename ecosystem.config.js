module.exports = {
  app: [
    {
      name: "elib-backend-app",
      script: "./dist/server.js",
      instances: "max",
      exer_mode: "cluster",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
