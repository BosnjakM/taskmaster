const mongoose = require('mongoose');
require('dotenv').config();

(async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB!');
        connection.disconnect();
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
})();
