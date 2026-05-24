const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis" });
    }

    if (users.find(user => user.username === username)) {
        return res.status(409).json({ message: "Utilisateur déjà existant" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "Utilisateur créé avec succès" });
});

// Get the book list available in the shop (async/await version)
public_users.get('/', async function (req, res) {
    // Fonction qui retourne une promesse contenant les livres
    const getBooks = () => {
        return new Promise((resolve, reject) => {
            if (books) {
                resolve(books);
            } else {
                reject(new Error("Livres non disponibles"));
            }
        });
    };

    try {
        const allBooks = await getBooks();
        res.status(200).json(allBooks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get book details based on ISBN (async/await version)
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    const getBookByIsbn = () => {
        return new Promise((resolve, reject) => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject(new Error("Livre non trouvé"));
            }
        });
    };

    try {
        const book = await getBookByIsbn();
        res.status(200).json(book);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});
  
// Get book details based on author (async/await version)
public_users.get('/author/:author', async function (req, res) {
    const authorName = req.params.author.toLowerCase();

    const getBooksByAuthor = () => {
        return new Promise((resolve, reject) => {
            const result = [];
            for (let isbn in books) {
                if (books[isbn].author.toLowerCase() === authorName) {
                    result.push(books[isbn]);
                }
            }
            if (result.length > 0) {
                resolve(result);
            } else {
                reject(new Error("Aucun livre trouvé pour cet auteur"));
            }
        });
    };

    try {
        const booksByAuthor = await getBooksByAuthor();
        res.status(200).json(booksByAuthor);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Get all books based on title (async/await version)
public_users.get('/title/:title', async function (req, res) {
    const titleName = req.params.title.toLowerCase();

    const getBooksByTitle = () => {
        return new Promise((resolve, reject) => {
            const result = [];
            for (let isbn in books) {
                if (books[isbn].title.toLowerCase() === titleName) {
                    result.push(books[isbn]);
                }
            }
            if (result.length > 0) {
                resolve(result);
            } else {
                reject(new Error("Aucun livre trouvé pour ce titre"));
            }
        });
    };

    try {
        const booksByTitle = await getBooksByTitle();
        res.status(200).json(booksByTitle);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book && book.reviews) {
        res.status(200).json(book.reviews);
    } else {
        res.status(404).json({ message: "Aucun avis trouvé pour cet ISBN" });
    }
});

module.exports.general = public_users;
