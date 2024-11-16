export async function onRequest(request, env, ctx) {
    await env.TVBOX.put("first-key", "This is the value for the key");
    return new Response('Hello, world!', { status: 200 });
}
