import 'dotenv/config'
import mongoose from 'mongoose'

import foodModel from './models/foodModel.js'
import orderModel from './models/orderModel.js'
import { connectDB } from './config/db.js'

console.log('Starting DB check...')

try {
    await connectDB()
    console.log('Connection verified, querying data...')
    
    const foods = await foodModel.find({}).lean()
    console.log('Foods count:', foods.length)
    console.log('Sample foods:', foods.slice(0, 3).map(f => ({name: f.name, category: f.category})))
    
    const orders = await orderModel.find({}).lean()
    console.log('Orders count:', orders.length)
    console.log('Sample orders:', orders.slice(0, 3).map(o => ({userId: o.userId, items: o.items?.length})))
    
} catch (error) {
    console.error('DB query error:', error.message)
    process.exit(1)
} finally {
    await mongoose.connection.close()
    console.log('DB connection closed.')
}
