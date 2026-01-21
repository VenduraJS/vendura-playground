import { createApiHandler } from "@vendura/next";
import { createOrder } from "vendura-core";
import { getCart, saveOrder } from "@vendura/mongodb";
import { createRazorpayOrder } from "@vendura/razorpay";
import { venduraConfig } from "@/vendura.config";

export const POST = createApiHandler(async (req) => {
  const { cartId } = await req.json();

  const cart = await getCart(cartId);
  if (!cart) throw new Error("NOT_FOUND");

  // Debug: log cart before order creation
  console.log("Checkout cart:", JSON.stringify(cart, null, 2));

  // Always recalculate total from items
  const totalAmount = cart.items.reduce((sum, item) => {
    const price = typeof item.price === "number" ? item.price : 0;
    const quantity = typeof item.quantity === "number" ? item.quantity : 0;
    return sum + price * quantity;
  }, 0);
  const total = {
    amount: totalAmount,
    currency: venduraConfig.payment.currency,
  };

  // Pass recalculated total to createOrder
  const order = createOrder({ ...cart, total  });
  await saveOrder(order);

  try {
    const razorpay = await createRazorpayOrder(order);
    return { order, razorpay };
  } catch (error: any) {
    // Log error in playground environment
    console.error("Razorpay Error:", error);
    return {
      order,
      razorpayError: error?.message || error,
    };
  }
});
