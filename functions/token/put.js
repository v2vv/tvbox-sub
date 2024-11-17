export async function onRequest(context) {
  await context.env.TVBOX.put("token", "This is the value for the key");
  const first_key = await context.env.TVBOX.get("first-key");
  return new Response(`Hello, world ${JSON.stringify(context)}!`, {
    status: 200,
  });
}
