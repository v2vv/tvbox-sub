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

      "/sub/ok": async () => {
        const response = await fetch(
          `https://py.nxog.top/zm/api/jm/api.php?ou=${encodeURIComponent(
            "http://ok321.top/tv"
          )}`,
          {
            headers: {
              accept: "*/*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
              priority: "u=1, i",
              "sec-ch-ua":
                '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": '"Windows"',
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              Referer: "https://py.nxog.top/zm/api/jm/",
              "Referrer-Policy": "strict-origin-when-cross-origin",
            },
            body: null,
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
            "https://tvbox.lvhongyuan.site/token/ali_token"
          )
          .replace(
            new RegExp(escapeRegExp("file://TV/quark_cookie.txt"), "g"),
            "https://tvbox.lvhongyuan.site/token/quark_cookie"
          )
          .replace(
            new RegExp(escapeRegExp("file://TV/uc_cookie.txt"), "g"),
            "https://tvbox.lvhongyuan.site/token/uc_cookie"
          );

        return new Response(custom_data_string, {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      },
      "/sub/fan": async () => {},
      "/sub/ouge": async () => {
        console.log("start");
        const response = await fetch(
          "https://ua.fongmi.eu.org/box.php?url=http%3A%2F%2Ftv.nxog.top%2Fm%2F",
          {
            method: "GET",
          }
        );
        console.log(response);
        // 获取响应的 JSON 数据
        const data_string = await response.text();

        // const data_string = JSON.stringify(data);

        console.log(data_string);
        // 帮助函数：转义正则中的特殊字符
        const escapeRegExp = (str) =>
          str.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");

        const custom_data_string = data_string
          .replace(
            new RegExp(escapeRegExp("http://127.0.0.1:9978/file/TV/.uc"), "g"),
            "https://tvbox.lvhongyuan.site/token/uc_cookie"
          )
          .replace(
            new RegExp(
              escapeRegExp("http://127.0.0.1:9978/file/TV/.quark"),
              "g"
            ),
            "https://tvbox.lvhongyuan.site/token/quark_cookie"
          )
          .replace(
            new RegExp(
              escapeRegExp("http://127.0.0.1:9978/file/TV/token.txt"),
              "g"
            ),
            "https://tvbox.lvhongyuan.site/token/ali_token"
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
