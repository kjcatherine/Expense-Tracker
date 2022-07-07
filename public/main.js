const deleteText = document.querySelectorAll(".fa-trash");
const editText = document.querySelectorAll(".fa-edit");
const postForm = document.querySelector(".form-1");
const numInput = document.querySelector(".num-input");
const textInput = document.querySelector(".text-input");
const msg = document.querySelector("#msg");

// Update fields
const updateContainer = document.querySelector(".update-section");
const updateAmount = document.querySelector(".update-section__amount");
const updateType = document.querySelector(".update-section__type");
const updateBtn = document.querySelector(".update-section__btn");

//EDIT FUNCTIONALITY
Array.from(editText).forEach((element) => {
  element.addEventListener("click", editEntry);
});

//Api request for Update
async function editExpense(id, amount, item) {
  try {
    await fetch("editExpense", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        expenseType: item,
        expenseAmt: amount.replace("$", ""),
      }),
    });
    window.location.reload(true);
  } catch (err) {
    console.log(err);
  }
}

//Edit function
async function editEntry(event) {
  const itemType = event.target.parentNode.children[0];
  const amount = event.target.parentNode.children[1];
  const expenseId = event.target.parentNode.children[2];

  // Hide first form
  postForm.classList.toggle("hidden");
  // Toggle off hidden and add visible for form 2
  updateContainer.classList.toggle("hidden");

  // Pass in id, and prepopulate field data
  updateAmount.value = amount.innerText;
  updateType.value = itemType.innerText;

  //Click event for update button
  updateBtn.addEventListener("click", async function (evt) {
    evt.preventDefault();

    await editExpense(expenseId.value, updateAmount.value, updateType.value);
  });
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
