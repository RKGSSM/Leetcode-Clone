const mongoose = require('mongoose');

const main = async () => {
    await mongoose.connect(process.env.DB_CONNECT_STRING);
}

module.exports = main;