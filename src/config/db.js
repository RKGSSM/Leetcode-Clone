const mongoose = require("mongoose");

const main = async () => {
    await mongoose.connect(process.env.DB_CONNECT_STRING);

    console.log("Connected Database:", mongoose.connection.db.databaseName);
};

module.exports = main;