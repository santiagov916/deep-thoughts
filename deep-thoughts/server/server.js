// import express .js
const express = require('express');

// import apollo
const { ApolloServer } = require('apollo-server-express');

// import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');

// import db
const db = require('./config/connection');

// create port connection for hosting
const PORT = process.env.PORT || 3001;

// create a new apollo server
const server = new ApolloServer({
    typeDefs,
    resolvers
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

