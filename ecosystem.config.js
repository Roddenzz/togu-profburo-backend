module.exports = {
  apps: [{
    name: 'aid-app',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/aid_app_web',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
