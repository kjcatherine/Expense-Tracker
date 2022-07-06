const deleteText = document.querySelectorAll(".fa-trash");
const editText = document.querySelectorAll(".fa-edit");
const hiddenCl = document.querySelectorAll(".hidden");
const inputs = document.querySelectorAll("span");

// if (hiddenCl) {
//   let idDb = hiddenCl.forEach((cl) => cl.getAttribute("value"));
//   console.log(idDb);
// }

//EDIT FUNCTIONALITY
Array.from(editText).forEach((element) => {
  element.addEventListener("click", editEntry);
});

async function editEntry() {
  const eType = this.parentNode.childNodes[1].innerText;
  const eAmount = this.parentNode.childNodes[3].innerText;
  hiddenCl.forEach((el) => (el.style.display = "block"));
  inputs.forEach((el) => (el.style.display = "none"));

  try {
    const response = await fetch("editExpense", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        expenseTypeE: eType,
        expenseAmtE: eAmount,
      }),
    });
    const data = await response.json();
    console.log(data);
    window.location.reload(true);
  } catch (err) {
    console.log(err);
  }
}

//DELETE FUNCTIONALITY
Array.from(deleteText).forEach((element) => {
  element.addEventListener("click", deleteExpense);
});

async function deleteExpense() {
  const dType = this.parentNode.childNodes[1].innerText;
  const dAmount = this.parentNode.childNodes[3].innerText;
  try {
    const response = await fetch("deleteExpense", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        expenseTypeD: dType,
        expenseAmtD: dAmount,
      }),
    });
    const data = await response.json();
    console.log(data);
    window.location.reload(true);
  } catch (err) {
    console.log(err);
  }
}
