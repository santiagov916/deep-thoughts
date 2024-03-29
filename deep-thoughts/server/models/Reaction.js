// import mongoose
const { Schema } = require('mongoose');

// import date formatting
const dateFormat = require('../utils/dateFormat');

const reactionSchema = new Schema (
    {
        reactionBody: {
            type: String,
            required: true,
            minLength: 1,
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: timestamp => dateFormat(timestamp)
        },
    },
    {
        toJSON: {
            getters: true
        }
    }
);

module.exports = reactionSchema;