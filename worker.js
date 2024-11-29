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
      "/sub/ok": async () => {
        const response = await fetch(
          `https://py.nxog.top/zm/api/jm/api.php?ou=${encodeURIComponent(
            "http://ok321.top/tv"
          )}`,
          {
            method: "GET",
          }
        );

        // 检查响应状态是否为 200
        if (!response.ok) {
          throw new Error("网络响应失败");
        }

        // 获取响应的 JSON 数据
        const data = await response.json();
        const data_string = JSON.stringify(data);
        // 帮助函数：转义正则中的特殊字符
        const escapeRegExp = (str) =>
          str.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");

        const custom_data_string = data_string
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

        return new Response(custom_data_string, {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      },
      "/sub/ouge": async () => {
        console.log("start");
        const response = await fetch(
          "https://ua.fongmi.eu.org/box.php?url=http%3A%2F%2Ftv.nxog.top%2Fm%2F",
          {
            method: "GET",
          }
        );
        // 获取响应的 JSON 数据
        const data_string = await response.text();

        // const data_string = JSON.stringify(data);

        // 帮助函数：转义正则中的特殊字符
        const escapeRegExp = (str) =>
          str.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");

        const custom_data_string = data_string
          .replace(
            new RegExp(escapeRegExp("http://127.0.0.1:9978/file/TV/.uc"), "g"),
            uc_cookie
          )
          .replace(
            new RegExp(
              escapeRegExp("http://127.0.0.1:9978/file/TV/.quark"),
              "g"
            ),
            quark_cookie
          )
          .replace(
            new RegExp(
              escapeRegExp("http://127.0.0.1:9978/file/TV/token.txt"),
              "g"
            ),
            ali_token
          );
        return new Response(custom_data_string, {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
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
