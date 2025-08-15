module.exports = {
  apps: [{
    name: "kaspa-backend",
    script: "dist/server.js",
    interpreter: "node",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production"
    },
    // Restart on file changes (development)
    watch: false,
    
    // Auto restart if app crashes
    autorestart: true,
    
    // Maximum number of restarts
    max_restarts: 10,
    
    // Minimum uptime before restart
    min_uptime: "10s",
    
    // Maximum memory before restart
    max_memory_restart: "1G",
    
    // Log configuration
    log_file: "./logs/combined.log",
    out_file: "./logs/out.log",
    error_file: "./logs/error.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    
    // Cluster mode (if needed)
    instances: 1,
    exec_mode: "fork"
  }]
}
