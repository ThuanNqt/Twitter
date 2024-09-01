// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'twitter',
      script: 'dist/index.js',
      interpreter: 'node',
      env: {
        NODE_ENV: 'development',
        TEN_BIEN: 'Gia tri'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}

/**
 * install: npm i pm2@latest -g
 * pm2 start dist/index.js
 * pm2 ls : show các tiến trình đang chạy
 * pm2 logs app_name --lines 200 : in ra 200 dòng
 * pm2 monit : hiển thị
 *
 * Nên tạo file ecosystem.config.js quản lý dễ hơn
 * PM2 dùng để tự khởi động lại app khi mà bị crash
 * pm2 start ecosystem.config.js để start
 * pm2 stop ecosystem.config.js để stop
 * pm2 restart ecosystem.config.js để restart
 * pm2 delete ecosystem.config.js để delete
 * pm2 start ecosystem.config.js --env production để chạy trên production
 */
