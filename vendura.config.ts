// vendura.config.ts

export const venduraConfig = {
  store: {
    name: "Vendura Playground",
    branding: {
      logoUrl: "",
      themeColor: "#3399cc"
    }
  },
  db: {
    adapter: "mongodb", // or "memory"
    mongoUrl: process.env.MONGO_URL || ""
  },
  payment: {
    provider: "razorpay",
    keyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
    keySecret: process.env.RAZORPAY_KEY_SECRET || "",
    currency: "INR"
  },
  security: {
    webhookSecret: process.env.WEBHOOK_SECRET || ""
  }
};
