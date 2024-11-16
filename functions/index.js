// 修改后
export default {
  async fetch(request, env, context) {
    return new Response("Hello from Cloudflare Pages Functions!");
  }
};