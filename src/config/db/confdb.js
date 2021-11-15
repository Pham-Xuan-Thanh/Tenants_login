const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;

async function connect(stringDBConnect="") {
    if (stringDBConnect === "") {
        stringDBConnect = 'mongodb://localhost:27017/Express_DB';
    }

    try {
        await mongoose.connect(stringDBConnect);
        console.log("Connect database successfully!!!  ");
        return null
    }catch (err ){
        console.log("Connect database Failure!!!  ");
        return err
    }
}

async function create(stringDBCreate) {
    try {
        await MongoClient.connect(stringDBCreate);
        console.log("Create database successfully!!!  ");
        return null
    }catch (err ){
        console.log("Create database Failure!!!  ");
        return err
    }
}

module.exports = {connect, create}