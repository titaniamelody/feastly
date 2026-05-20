import mongoose from 'mongoose';

const uri = "mongodb://Titania:Melody123@cluster0.losjdia.mongodb.net:27017/fooddelivery?directConnection=true";

console.log('Testing with database name...');

mongoose.connect(uri)
.then(() => {
    console.log('✓ Connected!');
    return mongoose.connection.close();
})
.catch(err => {
    console.error('✗ Failed:', err.message);
});