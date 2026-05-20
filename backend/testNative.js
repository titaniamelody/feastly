import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://Titania:Melody123@cluster0.losjdia.mongodb.net/";

console.log('Testing with MongoDB native client...');
console.log('URI:', uri.substring(0, 30) + '...');

const client = new MongoClient(uri);

client.connect()
.then(() => {
    console.log('✓ Connected!');
    return client.close();
})
.catch(err => {
    console.error('✗ Error:', err.name, err.message);
});