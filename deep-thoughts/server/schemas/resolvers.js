const { User, Thought } = require('../models');

// import AuthErr from Mongoose to handle Errors in the login
const { AuthenticationError } = require('apollo-server-express');

// import signToken function
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // use authMiddleware from context to authorize this query
        me: async (parent, args, context) => {

            if (context.user) {

                const userData = await User.findOne({ _id: context.user._id })
                
                .select('-__v -password')
                .populate('thoughts')
                .populate('friends');
    
                return userData;
            }

            throw new AuthenticationError('Not logged in')
        },

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
    },

    Mutation: {
        // accepts the args provided in the typeDefs
        addUser: async (parent, args) => {
            
            const user = await User.create(args);

            // use signToken to start a json web token
            const token = signToken(user);

            // return the token belonging to the user and the user data
            return { token, user};

        },
        // login accepts email and password as args
        login: async (parent, { email, password }) => {
            // user var is based on the email provided
            const user = await User.findOne({ email });
            // if that email does not exist throw an error
            if(!user) {
                throw new AuthenticationError('Incorrect credentials')
            }
            // correctPw var is to check the password match
            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw) {
                throw new AuthenticationError('Incorrect Password');
            }

            // create a token for the user
            const token = signToken(user);

            // return token belonging to the user and the user data
            return { token, user};
        },

        addThought: async (parent, args, context) => {

            if (context.user) {

                const thought = await Thought.create({ ...args, username: context.user.username });
    
                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { thoughts: thought._id }},
                    { new: true }
                );
    
                return thought;
            }

            throw new AuthenticationError('You need to be logged in!');
        },

        addReaction: async (parent, { thoughtId, reactionBody }, context) => {
            
            if (context.user) {

                const updatedThought = await Thought.findByIdAndUpdate(
                    { _id: thoughtId },
                    { $push: { reactions: { reactionBody, username: context.user.username } } },
                    { new: true, runValidators: true }
                );

                return updatedThought;
            }

            throw new AuthenticationError('You need to be logged in!');
        },

        addFriend: async (parent, { friendId }, context) => {

            if (context.user) {

                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { friends: friendId } },
                    { new: true}
                ).populate('friends');

                return updatedUser;
            }
            
            throw new AuthenticationError('You need to be logged in!');
        },

        deleteThought: async (parent, { thoughtId }, context) => {

            if (context.user) {

                const updateUser = await Thought.deleteOne({ _id: thoughtId });

                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { thought: thoughtId }},
                    { new: false }
                ).populate('thoughts');

                return updateUser;
            }

            throw new AuthenticationError('You need to be logged in!');
        }

    }
};

module.exports = resolvers;