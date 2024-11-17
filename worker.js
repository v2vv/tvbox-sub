// Cloudflare Worker 示例，根据路径选择不同的回应
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 根据不同的路径返回不同的回应
  if (pathname === "/") {
    return new Response("Welcome to the homepage!", {
      headers: { "content-type": "text/plain" },
    });
  } else if (pathname === "/about") {
    return new Response("This is the about page.", {
      headers: { "content-type": "text/plain" },
    });
  } else if (pathname === "/contact") {
    return new Response("Contact us at contact@example.com.", {
      headers: { "content-type": "text/plain" },
    });
  } else {
    return new Response("404 Not Found", {
      status: 404,
      headers: { "content-type": "text/plain" },
    });
  }
}
