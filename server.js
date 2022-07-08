const express = require("express");
const app = express();
const { ObjectId } = require("mongodb");
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






//Main Path
app.get("/", (request, response) => {
  const expenses = [];

  //DATE FORMATTING
  const formatDate = function (entryDate) {
    const day = `${entryDate.getDate()}`.padStart(2, 0);
    const month = `${entryDate.getMonth() + 1}`.padStart(2, 0);
    const year = entryDate.getFullYear();
    return `${day}/${month}/${year}`;
  }

  db.collection("expense")
    .find()
    .toArray()
    .then((data) => {
      data.forEach((expense) => {
        console.log(expense);
        expenses.push({
          id: ObjectId(expense._id),
          entryDate: expense.entryDate,
          expenseAmt: expense.expenseAmt,
          expenseType: expense.expenseType,
        });
      });
      response.render("index.ejs", { info: expenses });
    })
    .catch((error) => console.error(error));
});

//Create(post)
app.post("/addExpense", (request, response) => {
  if (!request.body.expenseAmt && !request.body.expenseType) {
    response.redirect("/");
    return;
  } else {
    db.collection("expense")
      .insertOne({
        entryDate: new Date(),
        expenseAmt: request.body.expenseAmt,
        expenseType: request.body.expenseType,
      })
      .then((result) => {
        response.redirect("/");
      })
      .catch((error) => console.error(error));
  }
});

//Edit Entry path
app.put("/editExpense", (request, response) => {
  let updateData = {};

  if (request.body.expenseAmt !== "") {
    updateData.expenseAmt = request.body.expenseAmt;
  }

  if (request.body.expenseType !== "") {
    updateData.expenseType = request.body.expenseType;
  }

  db.collection("expense")
    .updateOne(
      { _id: ObjectId(request.body.id) },
      {
        $set: updateData,
      }
    )
    .then((result) => {
      response.status = 200;
      response.json({ success: true, result });
      response.send();
    })
    .catch((error) => console.error(error));
});

//Delete entry
app.delete("/deleteExpense", (request, response) => {
  db.collection("expense")
    .deleteOne({ expenseType: request.body.expenseTypeD })
    .then((result) => {
      response.json("Expense Deleted");
    })
    .catch((error) => console.error(error));
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
