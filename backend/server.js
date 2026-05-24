import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import foodRouter from './routes/foodRoute.js'
import userRouter from './routes/userRoute.js'
import orderRouter from './routes/orderRoute.js'
import categoryRouter from './routes/categoryRoute.js'
import seedRouter from './routes/seedRoute.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env') })

console.log('MONGO_URI env:', process.env.MONGO_URI)

const app = express()
const port = 4000

app.use(express.json())
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}))

// (optional) request logging can be added here if needed

const startServer = async () => {
    try {
        await connectDB()
    } catch (err) {
        console.error('Failed to connect to DB:', err.message)
        process.exit(1)
    }

    app.use("/api/food", foodRouter)
    app.use("/images", express.static(path.join(__dirname, 'uploads')))
    app.use("/api/user", userRouter)
    app.use("/api/order", orderRouter)
    app.use("/api/category", categoryRouter)
    app.use("/api/seed", seedRouter)
    console.log("Category router mounted at /api/category")
    console.log("Seed router mounted at /api/seed")

    const frontendPath = path.join(__dirname, '../frontend/dist')
    app.use(express.static(frontendPath))

    app.use((req, res, next) => {
        if (req.path.startsWith('/api') || req.path.startsWith('/images')) {
            return next()
        }
        res.sendFile(path.join(frontendPath, 'index.html'))
    })

    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`)
    })
}

startServer()
