$ErrorActionPreference = "Stop"

$root = Get-Location
$apiBase = ""

if (Test-Path "$root\src\app") {
  $apiBase = "$root\src\app\api"
} elseif (Test-Path "$root\app") {
  $apiBase = "$root\app\api"
} else {
  throw "No app router found (expected app/ or src/app/)"
}

New-Item -ItemType Directory -Force -Path "$apiBase\_health\mongo" | Out-Null
New-Item -ItemType Directory -Force -Path "$apiBase\cart\create" | Out-Null
New-Item -ItemType Directory -Force -Path "$apiBase\cart\add-item" | Out-Null
New-Item -ItemType Directory -Force -Path "$apiBase\checkout" | Out-Null
New-Item -ItemType Directory -Force -Path "$apiBase\webhooks\razorpay" | Out-Null

@'
import { getClient } from "@vendura/mongodb";

export async function GET() {
  const client = await getClient();
  await client.db().command({ ping: 1 });
  return new Response("mongo ok");
}
'@ | Set-Content "$apiBase\_health\mongo\route.ts"

@'
import { createApiHandler } from "@vendura/next";
import { createCart } from "vendura-core";
import { saveCart } from "@vendura/mongodb";

export const POST = createApiHandler(async () => {
  const cart = createCart();
  await saveCart(cart);
  return cart;
});
'@ | Set-Content "$apiBase\cart\create\route.ts"

@'
import { createApiHandler } from "@vendura/next";
import { addItem } from "vendura-core";
import { getCart, saveCart } from "@vendura/mongodb";

export const POST = createApiHandler(async (req) => {
  const { cartId, item } = await req.json();

  const cart = await getCart(cartId);
  if (!cart) throw new Error("NOT_FOUND");

  addItem(cart, item);
  await saveCart(cart);

  return cart;
});
'@ | Set-Content "$apiBase\cart\add-item\route.ts"

@'
import { createApiHandler } from "@vendura/next";
import { createOrder } from "vendura-core";
import { getCart, saveOrder } from "@vendura/mongodb";
import { createRazorpayOrder } from "@vendura/razorpay";

export const POST = createApiHandler(async (req) => {
  const { cartId } = await req.json();

  const cart = await getCart(cartId);
  if (!cart) throw new Error("NOT_FOUND");

  const order = createOrder(cart);
  await saveOrder(order);

  const razorpay = await createRazorpayOrder(order);

  return { order, razorpay };
});
'@ | Set-Content "$apiBase\checkout\route.ts"

@'
import { createWebhookHandler } from "@vendura/next";
import { handleRazorpayWebhook } from "@vendura/webhooks";

export const POST = createWebhookHandler(async ({ body, headers }) => {
  const signature = headers.get("x-razorpay-signature");
  if (!signature) throw new Error("NO_SIGNATURE");

  await handleRazorpayWebhook(body, signature);
});
'@ | Set-Content "$apiBase\webhooks\razorpay\route.ts"

Write-Host "✅ Vendura API routes created successfully"
Write-Host "📍 API base: $apiBase"
