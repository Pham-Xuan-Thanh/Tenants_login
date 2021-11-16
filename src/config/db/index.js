const mongoose = require('mongoose')

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbAddress = process.env.DB_ADDRESS || "localhost:27017";
const dbBaseName = process.env.DB_BASENAME || "Express_DB";

async function connect(dbName = `${dbBaseName}`) {

    let dbConn = `mongodb://${dbUser}:${dbPassword}@${dbAddress}/${dbName}`

    if (!dbUser || !dbPassword)
        dbConn = `mongodb://${dbAddress}/${dbName}`;
    try {
        await mongoose.disconnect();
        await mongoose.connect(dbConn);
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