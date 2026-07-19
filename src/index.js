require('dotenv').config(); // must be first
console.log("ENV:", process.env.DB_CONNECT_STRING); // add this
console.log("PORT:", process.env.PORT);  
const express = require('express');
const app = express();
const main = require('./config/db');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());


main()
.then(async ()=>{
    app.listen(process.env.PORT, ()=>{
    })
})
.catch(err=> console.log("Error occured:" +err));

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`);
// });
