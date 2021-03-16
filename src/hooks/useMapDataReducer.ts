import { useReducer } from "react";
import { Statistics } from "model/statistics";
import { Vehicle } from "model/vehicle";
import { VehicleMapPoint } from "model/vehicleMapPoint";

type State = {
  vehicles: Record<string, VehicleMapPoint>;
  statistics: Statistics;
};

export enum ActionType {
  UPDATE_VEHICLES,
}

export type Action = {
  type: ActionType;
  payload?: any[];
};

const initialState: State = {
  vehicles: {},
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
          mapType === "ICONS"
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

const reducerFactory = (mapType: string) => (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.UPDATE_VEHICLES:
      return updateVehicles(state, action?.payload! as Vehicle[], mapType);
  }
};

export default function useVehicleReducer(mapType: string) {
  return useReducer(reducerFactory(mapType), initialState);
}
