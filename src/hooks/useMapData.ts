import { useApolloClient } from "@apollo/client";
import {
  FULL_VEHICLES_QUERY,
  STATIONS_QUERY,
  VEHICLES_QUERY,
} from "api/graphql";
import { useCallback, useEffect, useState } from "react";
import useMapDataReducer, { ActionType, State } from "./useMapDataReducer";
import { InitialViewStateProps } from "@deck.gl/core/lib/deck";
import { Filter } from "model/filter";

const DEFAULT_FETCH_POLICY = "no-cache";

export default function useVehicleData(
  viewState: InitialViewStateProps,
  radius: number,
  filter: Filter,
  mapType: string
): [State, boolean, () => void] {
  const [loading, setLoading] = useState<boolean>(false);
  const [state, dispatch] = useMapDataReducer(mapType);
  const client = useApolloClient();

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

  const refresh = useCallback(() => {
    setLoading(true);
    let abortController: AbortController | undefined;
    async function update() {
      abortController = new AbortController();

      const { data } = await client.query({
        query: query,
        fetchPolicy: DEFAULT_FETCH_POLICY,
        variables: {
          lat: viewState.latitude,
          lon: viewState.longitude,
          range: radius,
          ...filter,
        },
        context: {
          fetchOptions: {
            signal: abortController.signal,
          },
        },
      });
      setLoading(false);
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

    abortController?.abort();
    update();
    // eslint-disable-next-line
  }, [client, dispatch, viewState, viewState, filter, query]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, [filter, query]);

  return [state, loading, refresh];
}
