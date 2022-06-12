const deleteText = document.querySelectorAll(".fa-trash");
// const editText = document.querySelectorAll(".fa-edit");

Array.from(deleteText).forEach((element) => {
  element.addEventListener("click", deleteExpense);
});

// Array.from(editText).forEach((element) => {
//   element.addEventListener("click", editEntry);
// });

// async function editEntry() {
//   const eType = this.parentNode.childNodes[1].innerText;
//   const eAmount = this.parentNode.childNodes[3].innerText;
//   try {
//     const response = await fetch("editExpense", {
//       method: "put",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         expenseTypeD: eType,
//         expenseAmtD: eAmount,
//       }),
//     });
//     const data = await response.json();
//     console.log(data);
//     window.location.reload(true);
//   } catch (err) {
//     console.log(err);
//   }
// }

async function deleteExpense() {
  const eType = this.parentNode.childNodes[1].innerText;
  const eAmount = this.parentNode.childNodes[3].innerText;
  try {
    const response = await fetch("deleteExpense", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        expenseTypeD: eType,
        expenseAmtD: eAmount,
      }),
    });
    const data = await response.json();
    console.log(data);
    window.location.reload(true);
  } catch (err) {
    console.log(err);
  }
}
