const { ApolloServer, gql } = require('apollo-server-express');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type ExchangeRate {
    currency: String
    rate: String
    name: String
  }

  type Query {
    rates(currency: String!): [ExchangeRate]
  }
`;

const rates = [
  {
    currency: "AED",
    rate: "3.6732",
    name: "United Arab Emirates Dirham"
  },
  {
    currency: "AFN",
    rate: "86.019124",
    name: "Afghan Afghani"
  },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    rates: () => rates,
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
export const apolloServer = new ApolloServer({ typeDefs, resolvers });
