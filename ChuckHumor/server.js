const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const fetch = require('cross-fetch');



const typeDefs = gql`
  type ChuckNorrisJoke {
    icon_url: String
    id: String
    url: String
    value: String
  }

  type Query {
    categories: [String]
    randomJoke(category: String!): ChuckNorrisJoke
  }
`;


const chuckNorrisBaseUrl = 'https://api.chucknorris.io/jokes';

const resolvers = {
  Query: {
    categories: async () => {
      const response = await fetch(`${chuckNorrisBaseUrl}/categories`);
      const data = await response.json();
      return data;
    },
    randomJoke: async (_, { category }) => {
      const response = await fetch(`${chuckNorrisBaseUrl}/random?category=${category}`);
      const data = await response.json();
      return data;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });


const app = express();

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
}

// Start  server
const PORT = 4000;
startServer().then(() => {
  app.listen({ port: PORT }, () =>
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  );
});
