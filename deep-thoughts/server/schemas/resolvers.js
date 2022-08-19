const { User, Thought } = require('../models');

const resolvers = {
    Query: {
        // insert a username as  paramenter to fetch their thoughts
        thoughts: async (parent, { username }) => {
            // set the params as username and if none found return an empty string
            const params = username ? { username } : {};

            return Thought.find().sort({ createdAt: -1 });
        },
        // insert id as a parameter to select a single thought
        thought: async (parent, { _id }) => {

            return Thought.findOne({ _id });
        },

        users: async () => {
            return User.find()
            // don't include the password in the query
            .select('-__v -password')
            // populate the friend and thoughts field because its associated data
            .populate('friends')
            .populate('thoughts');
        },
        // insert a single id to get a single user
        user: async (parent, { username }) => {

            return User.findOne({ username })
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
        }
    }
};

module.exports = resolvers;