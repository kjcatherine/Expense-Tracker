const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const PORT = 2120;
require("dotenv").config();

let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "track-expenses";

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);

//Set server up
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (request, response) => {
  db.collection("expense")
    .find()
    .toArray()
    .then((data) => {
      response.render("index.ejs", { info: data });
    })
    .catch((error) => console.error(error));
});

app.post("/addExpense", (request, response) => {
  db.collection("expense")
    .insertOne({
      expenseAmt: request.body.expenseAmt,
      expenseType: request.body.expenseType,
      likes: 0,
    })
    .then((result) => {
      console.log(result);
      console.log("Expense Added");
      response.redirect("/");
    })
    .catch((error) => console.error(error));
});

app.delete("/deleteExpense", (request, response) => {
  db.collection("expense")
    .deleteOne({ expenseType: request.body.expenseTypeD })
    .then((result) => {
      console.log("Expense Deleted");
      response.json("Expense Deleted");
    })
    .catch((error) => console.error(error));
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
