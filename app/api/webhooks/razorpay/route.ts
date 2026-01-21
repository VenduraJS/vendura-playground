import { createWebhookHandler } from "@vendura/next";
import { handleRazorpayWebhook } from "@vendura/webhooks";


export const POST = createWebhookHandler(async ({ body, headers }) => {
  const signature = headers.get("x-razorpay-signature");
  if (!signature) throw new Error("NO_SIGNATURE");

  // Use venduraConfig.security.webhookSecret if needed in handleRazorpayWebhook
  await handleRazorpayWebhook(body, signature /*, venduraConfig.security.webhookSecret */);
});
