import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import fs from 'fs'
import { connectDB } from './config/db.js'
import foodRouter from './routes/foodRoute.js'
import userRouter from './routes/userRoute.js'
import orderRouter from './routes/orderRoute.js'
import categoryRouter from './routes/categoryRoute.js'
import seedRouter from './routes/seedRoute.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { uploadsDir } from './config/uploads.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()
const port = process.env.PORT || 4000

const allowedOrigins = [
  'https://feastly-eta.vercel.app',
  'https://feastly-titaniamelodys-projects.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
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

app.get('/', (req, res) => {
  res.json({ status: 'Server is running!', message: 'Feastly API Backend' })
})

app.get('/images/:filename', (req, res, next) => {
  const match = req.params.filename.match(/((?:food|menu)_\d+\.png)$/i)
  const file = match ? match[1] : req.params.filename
  const filePath = path.join(uploadsDir, file)
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath)
  }
  next()
})

app.use('/images', express.static(uploadsDir))

app.use('/api/food', foodRouter)
app.use('/api/user', userRouter)
app.use('/api/order', orderRouter)
app.use('/api/category', categoryRouter)
app.use('/api/seed', seedRouter)

const startServer = async () => {
  try {
    await connectDB()
  } catch (err) {
    console.error('Failed to connect to DB:', err.message)
    process.exit(1)
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server started on port ${port}`)
  })
}

startServer()
