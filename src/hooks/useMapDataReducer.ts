import { useReducer } from "react";
import { Statistics } from "model/statistics";
import { FormFactor, Vehicle } from "model/vehicle";
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
  UPDATE_VEHICLES_AND_STATIONS,
  CLEAR_DATA,
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
    numberOfStations: 0,
  },
};

const hasCar = (station: Station) =>
  station.vehicleTypesAvailable?.some(
    (vta) => vta.vehicleType?.formFactor === FormFactor.CAR
  );

const updateVehicles = (state: State, payload: Vehicle[], mapType: string) => {
  const vehicles = payload.reduce(
    (acc: Record<string, VehicleMapPoint>, vehicle: Vehicle) => {
      acc[vehicle.id] = {
        vehicle,
        icon:
          mapType === "ICONS"
            ? vehicle.vehicleType.formFactor.toLowerCase().startsWith("scooter")
              ? "scooter"
              : vehicle.vehicleType.formFactor.toLowerCase()
            : "",
      };
      return acc;
    },
    {}
  );

  return {
    ...state,
    stations: {},
    vehicles,
    statistics: {
      numberOfVehicles: Object.keys(vehicles).length,
      numberOfStations: 0,
    },
  };
};

const updateStations = (state: State, payload: Station[], mapType: string) => {
  const stations = payload.reduce(
    (acc: Record<string, StationMapPoint>, station: Station) => {
      acc[station.id] = {
        station,
        icon:
          mapType === "ICONS"
            ? hasCar(station)
              ? "car"
              : "bicycle_parking"
            : "",
      };
      return acc;
    },
    {}
  );

  return {
    ...state,
    vehicles: {},
    stations,
    statistics: {
      numberOfVehicles: 0,
      numberOfStations: Object.keys(stations).length,
    },
  };
};

const updateVehiclesAndStations = (
  state: State,
  payload: [Vehicle[], Station[]],
  mapType: string
) => {
  const vehicles = payload[0].reduce(
    (acc: Record<string, VehicleMapPoint>, vehicle: Vehicle) => {
      acc[vehicle.id] = {
        vehicle,
        icon:
          mapType === "ICONS"
            ? vehicle.vehicleType.formFactor.toLowerCase().startsWith("scooter")
              ? "scooter"
              : vehicle.vehicleType.formFactor.toLowerCase()
            : "",
      };
      return acc;
    },
    {}
  );

  const stations = payload[1].reduce(
    (acc: Record<string, StationMapPoint>, station: Station) => {
      acc[station.id] = {
        station,
        icon:
          mapType === "ICONS"
            ? hasCar(station)
              ? "car"
              : "bicycle_parking"
            : "",
      };
      return acc;
    },
    {}
  );

  return {
    ...state,
    stations,
    vehicles,
    statistics: {
      numberOfVehicles: Object.keys(vehicles).length,
      numberOfStations: Object.keys(stations).length,
    },
  };
};

const reducerFactory = (mapType: string) => (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.UPDATE_VEHICLES:
      return updateVehicles(state, action?.payload! as Vehicle[], mapType);
    case ActionType.UPDATE_STATIONS:
      return updateStations(state, action?.payload! as Station[], mapType);
    case ActionType.UPDATE_VEHICLES_AND_STATIONS:
      return updateVehiclesAndStations(
        state,
        action?.payload! as [Vehicle[], Station[]],
        mapType
      );
    case ActionType.CLEAR_DATA:
      return initialState;
  }
};

export default function useVehicleReducer(mapType: string) {
  return useReducer(reducerFactory(mapType), initialState);
}
