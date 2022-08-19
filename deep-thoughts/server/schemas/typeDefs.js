// import the gql tagged template function
const { gql } = require('apollo-server-express');

// import models
const { User, Thought } = require('../models');

// create typeDefs
const typeDefs = gql `

    type Thought {
        _id: ID
        thoughtText: String
        createdAt: String
        username: String
        reactions: [Reaction]
        reactionCount: Int
    }

    type User {
        _id: ID
        username: String
        email: String
        friendCount: Int
        thoughts: [Thought]
        friends: [User]
    }

    type Reaction {
        _id: ID
        reactionBody: String
        createdAt: String
        username: String
    }

    type Query {
        users: [User]
        user(username: String!): User
        thoughts(username: String): [Thought]
        thought(_id: ID!): Thought
    }
`;

module.exports = typeDefs;