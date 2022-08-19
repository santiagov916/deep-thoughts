// import express .js
const express = require('express');

// import db
const db = require('./config/connection');

// create port connection for hosting
const PORT = process.env.PORT || 3001;
const app = express();

// use app method to define server configs
app.use(express.urlencoded({ extended: false }));

// startup db
db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}`)
    });
});
