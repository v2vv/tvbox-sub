export default {
  async fetch(request, env, context) {
    try {
      // 使用 ASSETS.fetch() 获取静态资源
      const url = new URL(request.url);
      const pathname = url.pathname;

      // 如果请求的是根路径，返回 index.html
      if (pathname === "/") {
        // const assetResponse = await env.ASSETS.fetch("/dist/index.html");
    

        return new Response('Error loading page.', { status: 500 });

        // 返回 HTML 文件内容
        return new Response(await assetResponse.text(), {
          headers: {
            'Content-Type': 'text/html; charset=UTF-8'
          }
        });
      }

      // 如果请求的是其他路径，返回 404
      return new Response("Not Found2", { status: 404 });
    } catch (error) {
      console.error('Error:', error);
      return new Response('Internal Server Error d', { status: 500 });
    }
  }
};
