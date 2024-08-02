const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const connectDb = require('./config/connection');
const mongoose = require('mongoose');
require('dotenv').config();

const { typeDefs, resolvers } = require('./schemas');
const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/images', express.static(path.join(__dirname, '../client/images')));

  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  try {
    await connectDb();
    mongoose.connection.once('open', () => {
      app.listen(PORT, '0.0.0.0', (err) => {
        if (err) {
          console.error('Error starting server:', err);
          process.exit(1);
        }
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
      });
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

startApolloServer();

console.log(`Server is attempting to run on port: ${PORT}`);
