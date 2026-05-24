const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next){
    // Récupérer le token depuis l'en-tête Authorization
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({ message: "Token manquant" });
    }
    
    // Vérifier le token JWT
    jwt.verify(token, 'access', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Token invalide ou expiré" });
        }
        // Token valide → on passe à la suite
        next();
    });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
