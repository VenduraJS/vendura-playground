import { createApiHandler } from "@vendura/next";
import { addItem } from "vendura-core";
import { getCart, saveCart } from "@vendura/mongodb";
import { venduraConfig } from "@/vendura.config";

export const POST = createApiHandler(async (req) => {
  const { cartId, item } = await req.json();

  const cart = await getCart(cartId);
  if (!cart) throw new Error("NOT_FOUND");

  addItem(cart, item);
  (cart.total as any).currency = venduraConfig.payment.currency;
  await saveCart(cart);

  // Debug log: show cart total after adding item
  console.log("Cart after addItem:", {
    id: cart.id,
    total: cart.total,
    items: cart.items,
  });

  return cart;
});
