import { useApolloClient } from "@apollo/client";
import { VEHICLES_QUERY } from "api/graphql";
import { useEffect } from "react";
import useMapDataReducer, { ActionType } from "./useMapDataReducer";
import { InitialViewStateProps } from "@deck.gl/core/lib/deck";
import useDebounce from "./useDebounce";

const DEFAULT_FETCH_POLICY = "no-cache";

export default function useVehicleData(
  viewState: InitialViewStateProps,
  radius: number
) {
  const [state, dispatch] = useMapDataReducer();
  const client = useApolloClient();

  const debouncedViewState = useDebounce(viewState, 100);
  const debouncedRadius = useDebounce(radius, 100);

  useEffect(() => {
    async function update() {
      const { data: hydrationData } = await client.query({
        query: VEHICLES_QUERY,
        fetchPolicy: DEFAULT_FETCH_POLICY,
        variables: {
          lat: debouncedViewState.latitude,
          lon: debouncedViewState.longitude,
          range: debouncedRadius,
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
  }, [client, dispatch, debouncedViewState, debouncedRadius]);

  return state;
}
