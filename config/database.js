const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.DB_URI)

    console.log(`MongoDB connected : ${conn.connection.host}`.bgGreen.bold)
}

module.exports = connectDB