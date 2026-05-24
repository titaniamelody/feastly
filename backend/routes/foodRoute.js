import express from "express";
import { addFood, listFood, removeFood, updateFood } from "../controllers/foodController.js";
import multer from "multer";
import { requireAdmin } from "../middleware/auth.js";
import { uploadsDir } from "../config/uploads.js";

const foodRouter = express.Router()

// Image Storage Engine
const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: (req,file,cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage: storage})

foodRouter.post("/add", requireAdmin, upload.single("image"), addFood)
foodRouter.get("/list", listFood)
foodRouter.post("/remove", requireAdmin, removeFood)
foodRouter.post("/update", requireAdmin, upload.single("image"), updateFood)

export default foodRouter