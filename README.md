# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## 安装 wrangler

npm install wrangler --save-dev
npm install wrangler -g

## worker 本地开发

npx wrangler dev

## 部署

### 前端编译

npx vite build

### 上传 worker

npx wrangler deploy

## worker 部署

## page function 本地开发

Cloudflare wrangler pages 本地开发调试命令
npx wrangler pages dev
npx wrangler pages dev --remote

## vite 调试

npm run vite / npm run dev  
npx vite / npx vite dev
