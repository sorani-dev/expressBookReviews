const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });

});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  res.send(JSON.stringify(bookList, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  isbn = req.params.isbn
  try {
    const book = books[isbn]
    res.send(JSON.stringify(book, null, 4))
  } catch (error) {
    res.status(404).json(`Book with ISBN ${isbn} not found`);
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author
  filteredBooks = Object.entries(books).filter(book => book[1].author == author)
  return res.send(filteredBooks)
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title
  filteredBooks = Object.entries(bookList).filter(book => book[1].title == title)
  res.send(filteredBooks)
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  const isbn = req.params.isbn
  try {
    const book = books[isbn]
    const review = book.reviews
    res.send(JSON.stringify(review, null, 4))
  } catch (error) {
    res.status(404).json(`Book with ISBN ${isbn} cannot be found`);
  }
});

module.exports.general = public_users;
