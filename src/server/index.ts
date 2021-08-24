import * as express from "express";
import {makeExecutableSchema} from "apollo-server-express";
import streamToPromise from 'stream-to-promise';
const {
  GraphQLUpload,
  graphqlUploadExpress, // A Koa implementation is also exported.
} = require('graphql-upload');
const fs = require('fs');
const path = require('path');

const DESTINATION = 'uploaded_files';

const { ApolloServer, gql } = require('apollo-server-express');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Query {
    # This is only here to satisfy the requirement that at least one
    # field be present within the 'Query' type.  This example does not
    # demonstrate how to fetch uploads back.
    otherFields: Boolean!
  }

  type Mutation {
    # Multiple uploads are supported. See graphql-upload docs for details.
    singleUpload(file: Upload!, name: String!): File!
  }
`;

// Resolvers define the technique for fetching the types defined in the schema.
const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    otherFields: () => false,
  },
  Mutation: {
    singleUpload: async (parent: any, { file, name }: any) => {
      console.log('=====================================');
      console.log(file);
      console.log(name);

      const { createReadStream, filename, mimetype, encoding } = await file;

      // Invoking the `createReadStream` will return a Readable Stream.
      // See https://nodejs.org/api/stream.html#stream_readable_streams
      const stream = createReadStream();

      // Will upload all files to ${pwd}/uploaded_files
      fs.mkdirSync(DESTINATION, {recursive: true});
      const out = fs.createWriteStream(path.join(DESTINATION, name));
      stream.pipe(out);
      await streamToPromise(out);

      return { filename, mimetype, encoding };
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const apolloServer = new ApolloServer({schema, uploads: false});

export const initGraphql = (app: express.Express) => {
  // Add apollo server as middleware
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  apolloServer.applyMiddleware({ app });
};
