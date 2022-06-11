const deleteText = document.querySelectorAll(".fa-trash");

Array.from(deleteText).forEach((element) => {
  element.addEventListener("click", deleteExpense);
});

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
    location.reload();
  } catch (err) {
    console.log(err);
  }
}
