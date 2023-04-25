const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  return (userswithsamename.length > 0)
}

const authenticatedUser = (username, password) => { //returns boolean
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  return (validusers.length > 0)
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  isbn = req.params.isbn
  username = req.session.authorization.username
  review = req.body.review
  if (!review) {
    return res.status(401).json({ 'message': 'Please enter a review' })
  }

  // Get the book from its ISBN
  const book = books[isbn]
  if (book) {
    // Add a reviw and store it back into the book list
    book[username] = review
    books[isbn] = book
    return res.send(`Review for ISBN ${isbn} succesfully posted.`)
  }
  return res.status(404).json({ message: `Book ISBN ${isbn} not found` });
});

// Delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  const username = req.session.authorization.username
  const book = books[isbn]
  if (!book) {
    return res.status(404).json({ "message": `Book with ISBN ${isbn} not found` })
  }
  if (book.reviews[username]) {
    delete book.reviews[username]
  }
  return res.send(`Review for book ${isbn} succesfully deleted`)
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
