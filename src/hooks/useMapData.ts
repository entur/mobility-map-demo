import { useApolloClient } from "@apollo/client";
import {
  FULL_STATIONS_QUERY,
  FULL_VEHICLES_QUERY,
  HEATMAP_QUERY,
  ICONS_QUERY,
  STATIONS_QUERY,
  VEHICLES_QUERY,
} from "api/graphql";
import { useCallback, useEffect, useState } from "react";
import useMapDataReducer, { ActionType, State } from "./useMapDataReducer";
import { InitialViewStateProps } from "@deck.gl/core/lib/deck";
import { Filter } from "model/filter";
import { SystemType } from "model/options";

const DEFAULT_FETCH_POLICY = "no-cache";

export default function useVehicleData(
  viewState: InitialViewStateProps,
  radius: number,
  filter: Filter,
  mapType: string,
  systemTypes: Record<SystemType, boolean>
): [State, boolean, () => void] {
  const [loading, setLoading] = useState<boolean>(false);
  const [state, dispatch] = useMapDataReducer(mapType);
  const client = useApolloClient();

  let query = HEATMAP_QUERY;

  if (mapType === "HEATMAP") {
    if (Object.values(systemTypes).filter((t) => t).length > 1) {
      query = HEATMAP_QUERY;
    } else if (systemTypes[SystemType.DOCKED]) {
      query = STATIONS_QUERY;
    } else if (systemTypes[SystemType.FREEFLOATING]) {
      query = VEHICLES_QUERY;
    }
  } else if (mapType === "ICONS") {
    if (Object.values(systemTypes).filter((t) => t).length > 1) {
      query = ICONS_QUERY;
    } else if (systemTypes[SystemType.DOCKED]) {
      query = FULL_STATIONS_QUERY;
    } else if (systemTypes[SystemType.FREEFLOATING]) {
      query = FULL_VEHICLES_QUERY;
    }
  }

  const refresh = useCallback(() => {
    setLoading(true);
    async function update() {
      const { data } = await client.query({
        query: query,
        fetchPolicy: DEFAULT_FETCH_POLICY,
        variables: {
          lat: viewState.latitude,
          lon: viewState.longitude,
          range: radius,
          ...filter,
        },
      });
      setLoading(false);
      if (data && data.vehicles && data.stations) {
        dispatch({
          type: ActionType.UPDATE_VEHICLES_AND_STATIONS,
          payload: [data.vehicles, data.stations],
        });
      } else if (data && data.vehicles) {
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
    // eslint-disable-next-line
  }, [client, dispatch, viewState, viewState, filter, query]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, [filter, systemTypes, mapType, radius]);

  return [state, loading, refresh];
}
