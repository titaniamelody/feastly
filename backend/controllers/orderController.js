import 'dotenv/config';
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import Stripe from "stripe";

console.log("Stripe key loaded:", process.env.STRIPE_SECRET_KEY ? "YES" : "NO");

// Initialize Stripe only if valid key is provided
let stripe = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith("sk_")) {
    try {
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        console.log("Stripe initialized successfully");
    } catch (error) {
        console.log("Stripe initialization error:", error.message);
    }
} else {
    console.log("Stripe not configured - using COD only");
}

// Place order for COD
const placeOrder = async (req, res) => {
    const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";
    
    try {
        const { items, amount, address, paymentMethod } = req.body;
        
        // Extract userId from token if available
        let userId = "guest";
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
            } catch (e) {
                console.log("Invalid token, using guest");
            }
        }
        
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: paymentMethod || "COD",
            payment: paymentMethod === "COD" ? false : false,
            status: "Food Processing",
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // If payment method is Stripe and Stripe is configured, create a payment session
        if (paymentMethod === "Stripe" && stripe) {
            try {
                const line_items = items.map((item) => ({
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.name
                        },
                        unit_amount: item.price * 100
                    },
                    quantity: item.quantity
                }));

                line_items.push({
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Delivery Charges"
                        },
                        unit_amount: 2 * 100
                    },
                    quantity: 1
                });

                const session = await stripe.checkout.sessions.create({
                    line_items: line_items,
                    mode: 'payment',
                    success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
                    cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
                });

                console.log("Creating Stripe session, URL:", session.url);
res.json({ success: true, session_url: session.url });
            } catch (stripeError) {
                console.log("Stripe error:", stripeError);
                // Fall back to COD if Stripe fails
                res.json({ success: true, message: "Order placed successfully (COD fallback)", orderId: newOrder._id });
            }
        } else {
            // For COD, clear cart and redirect to orders
            res.json({ success: true, message: "Order placed successfully", orderId: newOrder._id });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error placing order" });
    }
}

// Verify Stripe payment
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Payment successful" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment failed" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error verifying payment" });
    }
}

// Get user orders
const getUserOrders = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.json({ success: false, message: "Not authorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const orders = await orderModel.find({ userId: decoded.id }).sort({ date: -1 });
        
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching orders" });
    }
};

// Get all orders (for admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching orders" });
    }
};

// Update order status (for admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status: status });
        res.json({ success: true, message: "Order status updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating order status" });
    }
};

export { placeOrder, verifyOrder, getUserOrders, getAllOrders, updateOrderStatus };
