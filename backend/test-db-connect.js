import './config/db.js';
import { connectDB } from './config/db.js';

process.env.MONGO_URI = 'mongodb+srv://Titania:Melody123@cluster0.losjdia.mongodb.net/?appName=Cluster0';

connectDB().then(() => {
  console.log('TEST OK');
  process.exit(0);
}).catch((err) => {
  console.error('TEST FAIL', err.message);
  process.exit(1);
});
