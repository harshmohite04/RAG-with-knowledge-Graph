const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lawfirm_connect';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
