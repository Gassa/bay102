import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";

const typeDefs = gql`
type Query {
  hello: String
}
`

const resolvers = {
  Query: { hello() { return 'world' } }
}

export const setupGraphQLServer = async () => {
  const graphqlServer = new ApolloServer({
    typeDefs, resolvers
  })

  await graphqlServer.start()
  return Promise.resolve(graphqlServer)
}