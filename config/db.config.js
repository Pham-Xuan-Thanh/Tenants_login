const mongoose = require('mongoose')

const dbURI = process.env.DB_URI || 'mongodb://127.0.0.1:27017'

async function connect(dbName = `GS247`) {

   
    try {
        await mongoose.disconnect();
        await mongoose.connect(`${dbURI}/${dbName}`);
        console.log("Connect database successfully!!!  ", dbName);
        return null;
    } catch (err) {
        console.log("Connect database Failure!!!  ", dbName);
        return err;
    }
}

async function disconnect(db = mongoose) {
    return db.disconnect();
}


module.exports = { connect, disconnect }