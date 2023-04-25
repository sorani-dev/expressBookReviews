const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

/**
 * Get the list of books as a Promise
 * 
 * @returns Promise
 */
function getBooks() {
  return new Promise((resolve, reject) => {
    resolve(books)
  })
}

/**
 * register user
 * method: POST
 */
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
  try {
    const bookList = await books;

    res.send(JSON.stringify(bookList, null, 4))
  } catch (error) {
    console.error(error)
    res.status(404).json({ message: "Unable to find book" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  isbn = req.params.isbn
  getBooks()
    .then(books => books[isbn])
    .then(book => res.send(JSON.stringify(book, null, 4)))
    .catch((error) => {
      res.status(error.status).json(error.message);
    })
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author
  try {
    const bookList = await books;
    filteredBooks = Object.entries(bookList).filter(book => book[1].author == author)
    return res.send(filteredBooks)
  } catch (error) {
    res.status(error.status).json(error.message);
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title
  try {
    const bookList = await books;
    filteredBooks = Object.entries(bookList).filter(book => book[1].title == title)
    res.send(filteredBooks)
  } catch (error) {
    res.status(error.status).json(error.message);
  }
});

// Get book review
public_users.get('/review/:isbn', async function (req, res) {
  const isbn = req.params.isbn
  try {
    const bookList = await books;
    const book = bookList[isbn]
    if (!book) {
      return res.status(404).json(`Cannot get review for book with ISBN ${isbn}`);
    }
    console.log(book)
    const review = book.reviews
    res.send(JSON.stringify(review, null, 4))
  } catch (error) {
    res.status(404).json(error.message);
  }
});

module.exports.general = public_users;
