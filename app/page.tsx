"use client";

import { useState } from "react";
import { RazorpayButton } from "./components/RazorpayButton";

export default function Home() {
  const [cartId, setCartId] = useState<string | null>(null);
  const [log, setLog] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [razorpay, setRazorpay] = useState<any>(null);

  async function createCart() {
    const res = await fetch("/api/cart/create", { method: "POST" });
    const data = await res.json();
    setCartId(data.id);
    setLog(data);
    setOrder(null);
    setRazorpay(null);
  }

  async function addItem() {
    if (!cartId) return;

    const res = await fetch("/api/cart/add-item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartId,
        item: {
          id: "sku_1",
          name: "Test Product",
          price: 50000,
          quantity: 1
        }
      })
    });

    setLog(await res.json());
  }

  async function checkout() {
    if (!cartId) return;

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartId })
    });

    const data = await res.json();
    setLog(data);
    setOrder(data.order);
    setRazorpay(data.razorpay);
  }

  return (
    <main style={{ padding: 32, fontFamily: "system-ui" }}>
      <h1>Vendura Playground</h1>

      <button onClick={createCart}>Create Cart</button>
      <br /><br />

      <button onClick={addItem} disabled={!cartId}>
        Add Item
      </button>
      <br /><br />

      <button onClick={checkout} disabled={!cartId}>
        Checkout
      </button>

      {order && razorpay && (
        <div style={{ marginTop: 24 }}>
          <RazorpayButton order={order} razorpay={razorpay} />
        </div>
      )}

      <pre style={{ marginTop: 24 }}>
        {JSON.stringify(log, null, 2)}
      </pre>
    </main>
  );
}
