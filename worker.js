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

    // async function githubFetch(url) {
    //   // 通过 fetch 请求 GitHub 文件
    //   const githubResponse = await fetch(url, {
    //     method: "GET",
    //   });

    //   // 检查响应是否成功
    //   if (!githubResponse.ok) {
    //     return new Response("Failed to fetch from GitHub", {
    //       status: githubResponse.status,
    //     });
    //   }

    //   // 修改响应头
    //   const newHeaders = new Headers(githubResponse.headers);
    //   if (newHeaders.get("Content-Type") === "application/octet-stream") {
    //     newHeaders.set("Content-Type", "text/html;charset=UTF-8"); // 替换为你想要的类型
    //   }

    //   // 返回新的响应
    //   return new Response(githubResponse.body, {
    //     status: githubResponse.status,
    //     statusText: githubResponse.statusText,
    //     headers: newHeaders,
    //   });
    // }

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
      // "/token/quark": async () => {
      //   // 定义目标 GitHub 文件的 URL
      //   const githubURL = "https://tvbox.lvhongyuan.site/token/quark_cookie"; // 替换为实际的 GitHub 文件地址
      //   return githubFetch(githubURL);
      // },
      // // "/token/quark": async () => {
      // //   const accounts = JSON.parse(await env.TVBOX.get("token"));
      // //   const mainAccounts = accounts.filter(
      // //     (account) => account.isMain && account.type === "夸克网盘"
      // //   );
      // //   if (mainAccounts.length === 0) {
      // //     return new Response("404 not found", { status: 404 });
      // //   }
      // //   return new Response(mainAccounts[0].cookie, {
      // //     headers: {
      // //       ...corsHeaders,
      // //       "Content-Type": "text/html;charset=UTF-8",
      // //     },
      // //   });
      // // },
      // "/token/ali": async () => {
      //   // 定义目标 GitHub 文件的 URL
      //   const githubURL = "https://tvbox.lvhongyuan.site/token/ali_token"; // 替换为实际的 GitHub 文件地址
      //   return githubFetch(githubURL);
      // },
      // // "/token/ali": async () => {
      // //   const accounts = JSON.parse(await env.TVBOX.get("token"));
      // //   const mainAccounts = accounts.filter(
      // //     (account) => account.isMain && account.type === "阿里网盘"
      // //   );
      // //   if (mainAccounts.length === 0) {
      // //     return new Response("404 not found", { status: 404 });
      // //   }
      // //   return new Response(mainAccounts[0].cookie, {
      // //     headers: {
      // //       ...corsHeaders,
      // //       "Content-Type": "text/html;charset=UTF-8",
      // //     },
      // //   });
      // // },
      // "/token/uc": async () => {
      //   // 定义目标 GitHub 文件的 URL
      //   const githubURL = "https://tvbox.lvhongyuan.site/token/uc_cookie"; // 替换为实际的 GitHub 文件地址
      //   return githubFetch(githubURL);
      // },
      // // "/token/uc": async () => {
      // //   const accounts = JSON.parse(await env.TVBOX.get("token"));
      // //   const mainAccounts = accounts.filter(
      // //     (account) => account.isMain && account.type === "UC网盘"
      // //   );
      // //   if (mainAccounts.length === 0) {
      // //     return new Response("404 not found", { status: 404 });
      // //   }
      // //   return new Response(mainAccounts[0].cookie, {
      // //     headers: {
      // //       ...corsHeaders,
      // //       "Content-Type": "text/html;charset=UTF-8",
      // //     },
      // //   });
      // // },
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
