const mongoose = require('mongoose')

async function connect(stringDBConnect="") {
    if (stringDBConnect === "") {
        stringDBConnect = 'mongodb://localhost:27017/Express_DB';
    }

    try {
        await mongoose.connect(stringDBConnect);
        console.log("Connect database successfully!!!  ");
    }catch (err ){
        console.log("Connect database Failure!!!  ");
    }
}

module.exports = {connect}