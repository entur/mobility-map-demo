const MOBILITY_GRAPHQL_ENDPOINT =
  process.env.REACT_APP_MOBILITY_GRAPHQL_ENDPOINT;
const MOBILITY_SUBSCRIPTIONS_ENDPOINT =
  process.env.REACT_APP_MOBILITY_SUBSCRIPTIONS_ENDPOINT;

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

export const getSubscriptionsEndpoint = () => {
  if (MOBILITY_SUBSCRIPTIONS_ENDPOINT) {
    return MOBILITY_SUBSCRIPTIONS_ENDPOINT;
  }

  switch (window.location.host) {
    case "mobility-map.staging.entur.org":
      return "wss://api.staging.entur.io/mobility/v2/subscriptions";
    case "mobility-map.entur.org":
      return "wss://api.entur.io/mobility/v2/subscriptions";
    default:
      return "wss://api.dev.entur.io/mobility/v2/subscriptions";
  }
};
