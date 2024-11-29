export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const ali_token = "https://tvbox.lvhongyuan.site/token/ali_token";
    const quark_cookie = "https://tvbox.lvhongyuan.site/token/quark_cookie";
    const uc_cookie = "https://tvbox.lvhongyuan.site/token/uc_cookie";

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

    // 帮助函数：转义正则中的特殊字符
    const escapeRegExp = (str) =>
      str.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");

    // 通用的缓存和响应头设置
    const addCustomHeaders = (response) => {
      response.headers.set("x-foo", "bar");
      return response;
    };

    // 获取替换后的字符串
    const replaceWithTokens = (data_string) => {
      return data_string
        .replace(
          new RegExp(escapeRegExp("file://TV/ali_token.txt"), "g"),
          ali_token
        )
        .replace(
          new RegExp(escapeRegExp("file://TV/quark_cookie.txt"), "g"),
          quark_cookie
        )
        .replace(
          new RegExp(escapeRegExp("file://TV/uc_cookie.txt"), "g"),
          uc_cookie
        );
    };

    // 路径处理映射
    const pathHandlers = {
      "/": async () =>
        new Response("Welcome to the homepage!", {
          headers: { "content-type": "text/plain" },
        }),
      "/sub/ok": async () => {
        const response = await fetch(
          `https://py.nxog.top/zm/api/jm/api.php?ou=${encodeURIComponent(
            "http://ok321.top/tv"
          )}`,
          { method: "GET" }
        );

        if (!response.ok) {
          throw new Error("网络响应失败");
        }

        const data = await response.json();
        const customDataString = replaceWithTokens(JSON.stringify(data));

        return new Response(customDataString, {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      },
      "/sub/ouge": async () => {
        const response = await fetch(
          "https://ua.fongmi.eu.org/box.php?url=http%3A%2F%2Ftv.nxog.top%2Fm%2F",
          { method: "GET" }
        );

        const dataString = await response.text();
        const customDataString = replaceWithTokens(dataString);

        return new Response(customDataString, {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      },
    };

    let res;

    // 根据路径调用对应处理函数
    if (pathHandlers[pathname]) {
      res = await pathHandlers[pathname](request);
    } else {
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
