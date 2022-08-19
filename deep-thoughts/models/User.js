// import mongoose and bcrypt
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// Create new User schema
// add username + password + email + thoughts + friends options
const userSchema = new Schema (
    {
        username: {
            type: String,
            require: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            require: true,
            unique: true,
            minLength: 3
        },
        email: {
            type: String,
            require: true,
            unique: true,
            match: [/.+@.+\..+/, 'Must match an email address!']
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends : [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        toJSON: {
            virtuals: true
        }
    }
);

// setup pre-save middleware to create password
userSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();
});

// compare passwords using bcrypt 'compare' method
userSchema.methods.isCorrectPassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

// use mongoose virtuals to add a method to check the friends count
userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

// create the name of the model
const User = model('User', userSchema);

// export the model
module.exports = User;