import {
  split,
  HttpLink,
  ApolloClient,
  InMemoryCache,
  ApolloLink,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { getGraphqlEndpoint } from "./config";

const httpLink = new HttpLink({
  uri: getGraphqlEndpoint(),
  headers: {
    "ET-Client-Name": "entur-mobility-map",
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  ApolloLink.empty(),
  httpLink
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    addTypename: false,
  }),
});
