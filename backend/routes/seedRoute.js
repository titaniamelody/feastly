import express from "express";
import { seedFoods, seedCategories } from "../controllers/seedController.js";
import { requireAdmin } from "../middleware/auth.js";

const seedRouter = express.Router();

seedRouter.post("/foods", requireAdmin, seedFoods);
seedRouter.post("/categories", requireAdmin, seedCategories);

export default seedRouter;
