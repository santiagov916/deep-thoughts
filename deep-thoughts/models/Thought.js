// import mongoose
const mongoose = require('mongoose');

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
            d
        }
    }
)