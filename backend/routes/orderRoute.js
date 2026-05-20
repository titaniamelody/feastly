import express from "express";
import { placeOrder, verifyOrder, getUserOrders, getAllOrders, updateOrderStatus } from "../controllers/orderController.js";
import { requireAdmin } from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/place", placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", getUserOrders);
orderRouter.get("/list", requireAdmin, getAllOrders);
orderRouter.post("/status", requireAdmin, updateOrderStatus);

export default orderRouter;
