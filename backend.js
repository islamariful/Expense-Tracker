// Welcome to my first Javascript project!!
// Disclaimer: this code is by no means perfect, I tried to piece together my approach
//    and external resources to create something that is functional and (visually)well-designed
// If you have any edits/improvements to suggest, I'd love to hear them!

//Expense Tracker:
//Constants for use in functions:
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
//These global constants are left as immutable constants which will be used in
//  creating and updating transactions in the future.
const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions'));
let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

//function that adds a transaction to the list of transactions:
//  it takes x as an input which is a list containing a text-value(string) 
//  and an amount-value(number)
function addtransaction(x) {
  x.preventDefault();
  //checks if either the name or amount is empty and alerts user accordingly
  if (text.value.trim() === '') {
    alert('Please add the name of the transaction');
  }
  else if (amount.value.trim() === '') {
    alert('Please add the amount of the transaction');
  }
  //else creates a transaction array with a random transaction number, name, and amount
  else {
      const transaction = {
        id: randomID(),
        text: text.value,
        amount: +amount.value
      };
    //adds transaction to list of transactions
    transactions.push(transaction);
    addtoDOM(transaction);
    updateValues();
    updateStorage();

    //Input prompts for the name and amount of the transaction to be added
    text.value = '';
    amount.value = '';
  }
}
//random transaction id generator
// Note: maybe throw in a if-else conditional to check if the random id
//  already exists in the list of transactions.
function randomID() {
    return ~~(Math.random() * (Math.pow(2, 20)));
}
//adding a transaction to the domestically stored list
function addtoDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  //note: could check the value of sign instead of transaction.amount again
  //  but for readability sake, transaction.amount might be clearer
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button class="delete-button" onclick="removetransaction(${
    transaction.id
  })">Remove</button>
  `;

  list.appendChild(item);
}
//updates the values of income, expense, and balance when transactions are added or removed
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  //calculating total remaining income
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  //calculating total remaining expenses
  const expense = (amounts
    .filter(item => item < 0)
    .reduce((acc, item) => (acc += item), 0)
    * -1)
  .toFixed(2);

  balance.innerText = `CAD $${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}
//removes a transaction from the local storage based on the unique transaction id
function removetransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateStorage();
  initialize();
}
//updates local storage
function updateStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}
//initializes the web-app
function initialize() {
  list.innerHTML = '';
  
  transactions.forEach(addtoDOM);
  updateValues;
}
initialize();

form.addEventListener('submit', addtransaction);