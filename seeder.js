const fs       = require('fs');
const mongoose = require('mongoose');
const colors   = require('colors');
const dotenv   = require('dotenv');

// Load env variables
dotenv.config({path : "./config/config.env"});

// Load model
const House = require('./models/house');
const User  = require('./models/user');

// Connect to DB
mongoose.connect(process.env.DB_URI);

// Read JSON file

const houseData = JSON.parse(fs.readFileSync(`${__dirname}/_data/houses.json`, 'utf-8'));
const userData  = JSON.parse(fs.readFileSync(`${__dirname}/_data/user.json`, 'utf-8'));

// Import data to db

const importData = async () => {
    try{
        await House.create(houseData);
        await User.create(userData);
        console.log('Data imported'.bgGreen.bold);
        process.exit();
    }catch(e){
        console.log(e);
    }
}

// Delete all data 

const deleteData = async () => {
    try{
        await House.deleteMany({});
        await User.deleteMany({});
        console.log('Data wiped'.bgRed.bold);
        process.exit();
    }catch(e){
        console.log(e);
    }
}


if(process.argv[2] === "-i") {
    importData();
}else if (process.argv[2] === "-d") {
    deleteData();
}