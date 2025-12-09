module.exports = {
<<<<<<< HEAD
  apps: [{
    name: 'dikshantias-next',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/dikshantiasnew',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
=======
  apps: [
    {
      name: "dikshantias",
      script: "npm",
      args: "start",
      cwd: "/root/dikshantiasnew",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
>>>>>>> 4bb5af4aa1e51e5da93d8a9b3ee5737564ba53d6
};
