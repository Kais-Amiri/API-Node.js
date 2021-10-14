const express = require("express");
require("dotenv").config({ path: "./configuration/.env" });
const connectToDb = require("./configuration/connectToDb");
const userRoutes = require("./routes/userRoutes");

const app = express();
const Port = process.env.port || 8080;

app.use(express.json());

connectToDb();

app.use("/", userRoutes);

app.listen(Port, (err) => {
  err
    ? console.log("Error:", err)
    : console.log(`Server listen successfully on Port ${Port}`);
});
