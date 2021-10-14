const mongoose = require("mongoose");

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully !!!");
  } catch (error) {
    console.log("We can't connect to database, there is an error : ", error);
  }
};

module.exports = connectToDb;
