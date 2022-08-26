// import express .js
const express = require('express');

const path = require('path');

// import apollo
const { ApolloServer } = require('apollo-server-express');

// import auth middleware
const { authMiddleware } = require('./utils/auth');

// import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');

// import db
const db = require('./config/connection');

// create port connection for hosting
const PORT = process.env.PORT || 3001;


// create a new apollo server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
});

const app = express();

// use app method to define server configs
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
    await server.start();

    // integrate our Apollo server with the Express application as middleware
    server.applyMiddleware({ app });

    if (process.env.NODE_ENV === "production") {
        app.use(express.static(path.join(__dirname, '../client/build')));
    }

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..client/build/index.html'));
    });

    // startup db
    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`API server running on port ${PORT}`);

            console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
        });
    });
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);

