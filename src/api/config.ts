const MOBILITY_GRAPHQL_ENDPOINT =
  process.env.REACT_APP_MOBILITY_GRAPHQL_ENDPOINT;

export const getGraphqlEndpoint = () => {
  if (MOBILITY_GRAPHQL_ENDPOINT) {
    return MOBILITY_GRAPHQL_ENDPOINT;
  }

  switch (window.location.host) {
    case "mobility-map.staging.entur.org":
      return "https://api.staging.entur.io/mobility/v2/graphql";
    case "mobility-map.entur.org":
      return "https://api.entur.io/mobility/v2/graphql";
    default:
      return "https://api.dev.entur.io/mobility/v2/graphql";
  }
};
