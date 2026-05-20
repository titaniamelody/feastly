import express from "express";
import multer from "multer";
import {
  addCategory,
  deleteCategory,
  listCategories,
} from "../controllers/categoryController.js";
import { requireAdmin } from "../middleware/auth.js";

const categoryRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => cb(null, `${Date.now()}${file.originalname}`),
});

const upload = multer({ storage });

// public (used on homepage and forms)
categoryRouter.get("/list", listCategories);

// admin-only
categoryRouter.post("/add", requireAdmin, upload.single("image"), addCategory);
categoryRouter.post("/remove", requireAdmin, deleteCategory);

export default categoryRouter;

