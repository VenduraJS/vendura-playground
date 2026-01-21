import { getClient } from "@vendura/mongodb";

export async function GET() {
  const client = await getClient();
  await client.db().command({ ping: 1 });
  return new Response("mongo ok");
}
