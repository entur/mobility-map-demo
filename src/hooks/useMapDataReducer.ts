import { useReducer } from "react";
import { Statistics } from "model/statistics";
import { Vehicle } from "model/vehicle";
import { VehicleMapPoint } from "model/vehicleMapPoint";
import { Station } from "model/station";
import { StationMapPoint } from "model/stationMapPoint";

export type State = {
  vehicles: Record<string, VehicleMapPoint>;
  stations: Record<string, StationMapPoint>;
  statistics: Statistics;
};

export enum ActionType {
  UPDATE_VEHICLES,
  UPDATE_STATIONS,
}

export type Action = {
  type: ActionType;
  payload?: any[];
};

const initialState: State = {
  vehicles: {},
  stations: {},
  statistics: {
    numberOfVehicles: 0,
  },
};

const updateVehicles = (state: State, payload: Vehicle[], mapType: string) => {
  const vehicles = payload.reduce(
    (acc: Record<string, VehicleMapPoint>, vehicle: Vehicle) => {
      acc[vehicle.id] = {
        vehicle,
        icon:
          mapType === "VEHICLE_ICONS"
            ? vehicle.vehicleType.formFactor.toLowerCase()
            : "",
      };
      return acc;
    },
    {}
  );

  return {
    ...state,
    vehicles,
    statistics: {
      numberOfVehicles: Object.keys(vehicles).length,
    },
  };
};

const updateStations = (state: State, payload: Station[]) => {
  const stations = payload.reduce(
    (acc: Record<string, StationMapPoint>, station: Station) => {
      acc[station.id] = {
        icon: "bicycle_parking",
        station,
      };
      return acc;
    },
    {}
  );

  return {
    ...state,
    stations,
  };
};

const reducerFactory = (mapType: string) => (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.UPDATE_VEHICLES:
      return updateVehicles(state, action?.payload! as Vehicle[], mapType);
    case ActionType.UPDATE_STATIONS:
      return updateStations(state, action?.payload! as Station[]);
  }
};

export default function useVehicleReducer(mapType: string) {
  return useReducer(reducerFactory(mapType), initialState);
}
