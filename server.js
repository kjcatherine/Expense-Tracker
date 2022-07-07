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

app.get("/", (request, response) => {
  const expenses = [];
  db.collection("expense")
    .find()
    .toArray()
    .then((data) => {
      data.forEach((expense) => {
        console.log(expense);
        expenses.push({
          id: ObjectId(expense._id),
          expenseAmt: expense.expenseAmt,
          expenseType: expense.expenseType,
        });
      });
      response.render("index.ejs", { info: expenses });
    })
    .catch((error) => console.error(error));
});

app.post("/addExpense", (request, response) => {
  if (!request.body.expenseAmt && !request.body.expenseType) {
    response.redirect("/");
    return;
  } else {
    db.collection("expense")
      .insertOne({
        expenseAmt: request.body.expenseAmt,
        expenseType: request.body.expenseType,
      })
      .then((result) => {
        console.log(result);
        console.log("Expense Added");
        response.redirect("/");
      })
      .catch((error) => console.error(error));
  }
});

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

//Edit entry
// app.put("/editExpense", (request, response) => {

//   db.collection("expense")
//     .updateOne(
//       { expenseType: request.body.expenseTypeE },
//       {
//         $set: {
//           expenseType: request.body.expenseTypeE,
//           expenseAmt: request.body.expenseAmtE,
//         },
//       }
//     )
//     .then((result) => {
//       response.redirect("/");
//       response.json("input edited");
//     })
//     .catch((error) => console.error(error));
// });

//Delete entry
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
