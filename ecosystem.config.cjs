module.exports = {
  apps: [
    {
      name: "myapp",
      script: "./server.js", // Path to your application file
      instances: 3, // Number of instances to run
      exec_mode: "cluster", // Enable cluster mode
      watch: false, // Optional: Watch for file changes
      env: {
        NODE_ENV: "development", // Environment variables for development
      },
      env_production: {
        NODE_ENV: "production", // Environment variables for production
      },
    },
  ],
};
