const express      = require('express');
const connectDB    = require('./config/database');
const fileupload   = require('express-fileupload')
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const dotenv       = require('dotenv');
const morgan       = require('morgan');
const path         = require('path');
const colors       = require('colors');

// Loads env variables 
dotenv.config({ path : './config/config.env' });

// Load database
    connectDB()

// Routes files

const houseRoute    = require('./routes/house');
const auth          = require('./routes/auth');
const userRoute     = require('./routes/user');
const visitRoute = require('./routes/visit');


// Initializing express app
const app = express();

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))) 
app.use(express.json());
app.use(fileupload());
if(process.env.NODE_ENV === 'developpement'){
    app.use(morgan('dev'));
}

// Mounting Route
app.use(houseRoute);
app.use(auth);
app.use(userRoute);
app.use(visitRoute);

// Using middleware
app.use(errorHandler);

// Listening server

app.listen(process.env.PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.bgGreen.bold);
})
