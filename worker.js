// Cloudflare Worker 示例，根据路径选择不同回应并添加自定义头，同时缓存响应
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    let res;

    // 根据不同路径返回不同的回应
    if (pathname === "/") {
      res = new Response("Welcome to the homepage!", {
        headers: { "content-type": "text/plain" },
      });
    } else if (pathname === "/about") {
      res = new Response("This is the about page.", {
        headers: { "content-type": "text/plain" },
      });
    } else if (pathname === "/contact") {
      res = new Response("Contact us at contact@example.com.", {
        headers: { "content-type": "text/plain" },
      });
    } else {
      // 转发原始请求
      res = await fetch(request);
      res = new Response(res.body, res);
    }

    // 添加自定义头
    res.headers.set("x-foo", "bar");

    // 异步缓存响应
    ctx.waitUntil(caches.default.put(request, res.clone()));

    // 返回响应
    return res;
  },
};
