import { GraphQLClient } from "graphql-request";

const SUBGRAPH_URL = "https://api.studio.thegraph.com/query/95085/isi-services-subgraph/version/latest";

export const subgraphClient = new GraphQLClient(SUBGRAPH_URL);
