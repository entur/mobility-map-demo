import { useApolloClient } from "@apollo/client";
import {
  FULL_VEHICLES_QUERY,
  STATIONS_QUERY,
  VEHICLES_QUERY,
} from "api/graphql";
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

  const debouncedViewState = useDebounce(viewState, 500);
  const debouncedRadius = useDebounce(radius, 500);

  let query = FULL_VEHICLES_QUERY;

  switch (mapType) {
    case "VEHICLE_HEATMAP":
      query = VEHICLES_QUERY;
      break;
    case "VEHICLE_ICONS":
      query = FULL_VEHICLES_QUERY;
      break;
    case "STATIONS":
      query = STATIONS_QUERY;
      break;
  }

  useEffect(() => {
    async function update() {
      const { data } = await client.query({
        query: query,
        fetchPolicy: DEFAULT_FETCH_POLICY,
        variables: {
          lat: debouncedViewState.latitude,
          lon: debouncedViewState.longitude,
          range: debouncedRadius,
          ...filter,
        },
      });
      if (data && data.vehicles) {
        dispatch({
          type: ActionType.UPDATE_VEHICLES,
          payload: data.vehicles,
        });
      } else if (data && data.stations) {
        dispatch({
          type: ActionType.UPDATE_STATIONS,
          payload: data.stations,
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
