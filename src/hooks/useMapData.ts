import { useApolloClient } from "@apollo/client";
import { FULL_VEHICLES_QUERY, VEHICLES_QUERY } from "api/graphql";
import { useEffect } from "react";
import useMapDataReducer, { ActionType } from "./useMapDataReducer";
import { InitialViewStateProps } from "@deck.gl/core/lib/deck";
import useDebounce from "./useDebounce";
import { Filter } from "model/filter";

const DEFAULT_FETCH_POLICY = "no-cache";

export default function useVehicleData(
  viewState: InitialViewStateProps,
  radius: number,
  filter: Filter,
  mapType: string
) {
  const [state, dispatch] = useMapDataReducer(mapType);
  const client = useApolloClient();

  const debouncedViewState = useDebounce(viewState, 100);
  const debouncedRadius = useDebounce(radius, 100);

  const query = mapType === "HEATMAP" ? VEHICLES_QUERY : FULL_VEHICLES_QUERY;

  useEffect(() => {
    async function update() {
      const { data: hydrationData } = await client.query({
        query: query,
        fetchPolicy: DEFAULT_FETCH_POLICY,
        variables: {
          lat: debouncedViewState.latitude,
          lon: debouncedViewState.longitude,
          range: debouncedRadius,
          ...filter,
        },
      });
      if (hydrationData && hydrationData.vehicles) {
        dispatch({
          type: ActionType.UPDATE_VEHICLES,
          payload: hydrationData.vehicles,
        });
      }
    }
    update();

    const timer = setInterval(() => {
      update();
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [client, dispatch, debouncedViewState, debouncedRadius, filter, query]);

  return state;
}
