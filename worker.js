export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    // 统一处理 OPTIONS 请求，返回 CORS 预检响应
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 通用的缓存和响应头设置
    const addCustomHeaders = (response) => {
      response.headers.set("x-foo", "bar");
      return response;
    };

    // 路径处理映射
    const pathHandlers = {
      "/": async () =>
        new Response("Welcome to the homepage!", {
          headers: { "content-type": "text/plain" },
        }),
      "/contact": async () =>
        new Response("Contact us at contact@example.com.", {
          headers: { "content-type": "text/plain" },
        }),
      "/token": async (request) => {
        if (request.method === "POST") {
          const data = await request.json();
          if (data.method === "add") {
            await env.TVBOX.put("token", JSON.stringify(data.data));
            return new Response(JSON.stringify(data.data), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          } else if (data.method === "delete") {
            await env.TVBOX.put("token", []);
            return new Response("Token deleted", { headers: corsHeaders });
          }
          return new Response(
            JSON.stringify("Request successful, undefined operation!"),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } else if (request.method === "GET") {
          const tokenData = await env.TVBOX.get("token");
          return new Response(tokenData, {
            headers: { ...corsHeaders, "content-type": "text/plain" },
          });
        }
        return new Response("Only POST/GET requests are allowed", {
          status: 405,
        });
      },
      "/token/quark": async () => {
        const accounts = JSON.parse(await env.TVBOX.get("token"));
        const mainAccounts = accounts.filter(
          (account) => account.isMain && account.type === "夸克网盘"
        );
        if (mainAccounts.length === 0) {
          return new Response("404 not found", { status: 404 });
        }
        return new Response(JSON.stringify(mainAccounts[0].cookie), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      },
      "/token/ali": async () => {
        const accounts = JSON.parse(await env.TVBOX.get("token"));
        const mainAccounts = accounts.filter(
          (account) => account.isMain && account.type === "阿里网盘"
        );
        if (mainAccounts.length === 0) {
          return new Response("404 not found", { status: 404 });
        }
        return new Response(JSON.stringify(mainAccounts[0].cookie), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      },
      "/token/uc": async () => {
        const accounts = JSON.parse(await env.TVBOX.get("token"));
        const mainAccounts = accounts.filter(
          (account) => account.isMain && account.type === "UC网盘"
        );
        if (mainAccounts.length === 0) {
          return new Response("404 not found", { status: 404 });
        }
        return new Response(JSON.stringify(mainAccounts[0].cookie), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      },
    };

    let res;

    // 根据路径调用对应处理函数
    if (pathHandlers[pathname]) {
      res = await pathHandlers[pathname](request);
    } else {
      // 对于未知路径，返回 404
      res = new Response("404 Not Found", {
        status: 404,
        headers: corsHeaders,
      });
    }

    // 添加自定义头并缓存响应
    res = addCustomHeaders(res);
    ctx.waitUntil(caches.default.put(request, res.clone()));
    return res;
  },
};
