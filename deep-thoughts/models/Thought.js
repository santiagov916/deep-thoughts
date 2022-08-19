// import mongoose
const mongoose = require('mongoose');

// import reaction schema
const reactionSchema = require('./Reaction');

// import time stamp for the date
const dateFormat = require('../utils/dateFormat');

const thoughtSchema = new Schema (
    {
        thought: {
            type: String,
            minLength: 1,
            maxLength: 150,
            required: 'You need to leave a thought'
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: timestamp => dateFormat(timestamp)
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionSchema],
        toJSON: {
            getters: true
        }
    }
);

thoughtSchema.virtuals('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;