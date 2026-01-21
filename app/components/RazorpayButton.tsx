import React from "react";

declare global {
    interface Window {
        Razorpay?: any;
    }
}

interface RazorpayOrder {
    id: string;
    amount: number;
    currency: string;
}

interface RazorpayButtonProps {
    order?: any; // Not used, but typed to avoid error
    razorpay: RazorpayOrder;
}

export function RazorpayButton({ order, razorpay }: RazorpayButtonProps) {
    const handlePay = () => {
        if (!window.Razorpay) {
            alert("Razorpay SDK not loaded");
            return;
        }
        const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || (typeof window !== "undefined" ? (window as any).RAZORPAY_KEY_ID : undefined);
        if (!key) {
            alert("Razorpay key is missing. Please set NEXT_PUBLIC_RAZORPAY_KEY_ID in your .env.local and restart the dev server.");
            return;
        }
        const options = {
            key,
            amount: razorpay.amount, // in paise
            currency: razorpay.currency,
            name: "Vendura Playground",
            description: "Test Transaction",
            order_id: razorpay.id,
            handler: function (response: { razorpay_payment_id: string }) {
                alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
            },
            prefill: {
                name: "Test User",
                email: "test@example.com",
                contact: "9999999999"
            },
            theme: {
                color: "#3399cc"
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    React.useEffect(() => {
        if (!window.Razorpay) {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    return (
        <button onClick={handlePay} style={{ padding: "10px 20px", background: "#3399cc", color: "#fff", border: "none", borderRadius: "4px" }}>
            Pay with Razorpay
        </button>
    );
}
