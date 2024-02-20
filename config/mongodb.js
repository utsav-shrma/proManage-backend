const mongoose = require("mongoose");
require("dotenv").config();

const connectionString = process.env.DATABASE_CONNECTION_STRING;
const mongodb = mongoose.connect(connectionString)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log(error);
  });
module.exports = mongodb;
