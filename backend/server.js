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

const app = express()
const port = process.env.PORT || 4000
const isVercel = process.env.VERCEL === '1'

const allowedOrigins = [
  'https://feastly-eta.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(null, false)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json())

let dbReady = null
const ensureDb = () => {
  if (!dbReady) {
    dbReady = connectDB().catch((err) => {
      dbReady = null
      throw err
    })
  }
  return dbReady
}

app.use(async (req, res, next) => {
  try {
    await ensureDb()
    next()
  } catch (err) {
    console.error('Database unavailable:', err.message)
    res.status(503).json({ success: false, message: 'Database unavailable' })
  }
})

app.get('/', (req, res) => {
  res.json({ status: 'Server is running!', message: 'Feastly API Backend' })
})

app.use('/api/food', foodRouter)
app.use('/images', express.static(path.join(__dirname, 'uploads')))
app.use('/api/user', userRouter)
app.use('/api/order', orderRouter)
app.use('/api/category', categoryRouter)
app.use('/api/seed', seedRouter)

if (!isVercel) {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server started on port ${port}`)
  })
}

export default app
