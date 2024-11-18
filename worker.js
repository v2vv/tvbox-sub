// Cloudflare Worker 示例，根据路径选择不同回应并添加自定义头，同时缓存响应
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    let res;

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type", // 添加这一行
      "Access-Control-Max-Age": "86400",
    };

    // 如果是 OPTIONS 请求，返回 CORS 预检响应
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

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
      //token "POST" 处理
      if (request.method === "POST") {
        // 解析请求中的JSON数据
        const data = await request.json();

        //data 数据校验
        if (data[0].id) {
          var dataTemp = await env.TVBOX.get("token");

          // 检查 dataTemp 是否为 null 或空字符串
          if (dataTemp) {
            dataTemp = JSON.parse(dataTemp);
          } else {
            dataTemp = []; // 或者设置为某个默认对象
          }

          dataTemp.push(data);
          console.log(dataTemp);
          // 添加数据到 KV
          await env.TVBOX.put("token", JSON.stringify(dataTemp));

          // 返回响应
          res = new Response(JSON.stringify(dataTemp), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else {
          // data 数据校验失败
          res = new Response(JSON.stringify("请求成功，数据类型错误!"), {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          });
        }
      } else if (request.method === "GET") {
        //token "GET" 处理
        const restemp = await env.TVBOX.get("token");
        res = new Response(restemp, {
          headers: { ...corsHeaders, "content-type": "text/plain" },
        });
      } else {
        res = new Response("Only POST/GET requests are allowed", {
          status: 405,
        });
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
