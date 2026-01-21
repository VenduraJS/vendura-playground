import { createApiHandler } from "@vendura/next";
import { createCart } from "vendura-core";
import { saveCart } from "@vendura/mongodb";
import { venduraConfig } from "@/vendura.config";

export const POST = createApiHandler(async () => {
  const cart = createCart();
  // Fix type: allow any string for currency
  (cart.total as any).currency = venduraConfig.payment.currency;
  await saveCart(cart);
  return cart;
});
