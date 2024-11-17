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
    } else if (pathname === "/token/ali") {
      const token = await env.TVBOX.get("token");
      try {
        const aliToken = JSON.parse(token).ali.main.token;
      } catch (error) {}

      res = new Response(`This is the about page ${token}.`, {
        headers: { "content-type": "text/plain" },
      });
    } else if (pathname === "/contact") {
      res = new Response("Contact us at contact@example.com.", {
        headers: { "content-type": "text/plain" },
      });
    } else if (pathname === "/token") {
      if (request.method === "POST") {
        // 解析请求中的JSON数据
        const data = await request.json();
        await env.TVBOX.put("token", JSON.stringify(data));
        // 在此处理数据，例：输出数据到控制台
        console.log(data);
        // 返回响应
        return new Response(
          JSON.stringify({ message: "Data received successfully", data: data }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      } else if (request.method === "GET") {
        const restemp = await env.TVBOX.get("token");
        res = new Response(restemp, {
          headers: { "content-type": "text/plain" },
        });
      } else {
        return new Response("Only POST requests are allowed", { status: 405 });
      }
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
