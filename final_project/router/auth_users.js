const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis" });
    }

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    }

    // Générer un token JWT (vérifiez la clé secrète utilisée dans index.js)
    const token = jwt.sign({ username }, 'access', { expiresIn: '1h' });
    return res.status(200).json({ message: "Connexion réussie", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.user; // doit être défini par le middleware d'authentification

    if (!review) {
        return res.status(400).json({ message: "Avis requis" });
    }
    if (!books[isbn]) {
        return res.status(404).json({ message: "Livre non trouvé" });
    }

    // Initialiser l'objet reviews si nécessaire
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Ajouter ou modifier l'avis pour cet utilisateur
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Avis ajouté/modifié avec succès" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user; // doit être défini par le middleware

    if (!books[isbn]) {
        return res.status(404).json({ message: "Livre non trouvé" });
    }
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Avis non trouvé pour cet utilisateur" });
    }

    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Avis supprimé avec succès" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
