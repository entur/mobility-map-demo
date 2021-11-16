import React, { useCallback, useState } from "react";
import { Map } from "../Map";
import "./App.scss";
import useMapData from "hooks/useMapData";
import { InitialViewStateProps } from "@deck.gl/core/lib/deck";
import { ControlPanel } from "components/ControlPanel";
import { Options, SystemType } from "model/options";
import { Filter } from "model/filter";
import { GeofencingZonesOptions } from "model/geofencingZonesOptions";
import useGeofencingZones from "hooks/useGeofencingZones";
import { GeofencingZone } from "model/geofencingZone";

const defaultOptions: Options = {
  radius: 5000,
  mapStyle: "ICONS",
  systemTypes: { [SystemType.DOCKED]: true, [SystemType.FREEFLOATING]: true },
};

const defaultFilter: Filter = {
  includeReserved: false,
  includeDisabled: false,
};

const defaultGeofencingZonesOptions: GeofencingZonesOptions = {
  enabled: false,
  selectedGeofencingZones: [],
  geofencingZones: [],
};

// Viewport settings
const INITIAL_VIEW_STATE: InitialViewStateProps = {
  longitude: 10.757933,
  latitude: 59.911491,
  zoom: 12,
  pitch: 0,
  bearing: 0,
};

export const App = () => {
  const [options, setOptions] = useState<Options>(defaultOptions);
  const [filter, setFilter] = useState<Filter>(defaultFilter);
  const [
    geofencingZonesOptions,
    setGeofencingZonesOptions,
  ] = useState<GeofencingZonesOptions>(defaultGeofencingZonesOptions);
  const [viewState, setViewState] = useState<InitialViewStateProps>(
    INITIAL_VIEW_STATE
  );

  const [{ vehicles, stations, statistics }, loading, refresh] = useMapData(
    viewState,
    options.radius!,
    filter,
    options.mapStyle!,
    options.systemTypes
  );

  const onGeofencingZonesChanged = useCallback(
    (geofencingZones: GeofencingZone[]) => {
      setGeofencingZonesOptions((geofencingZonesOptions) => ({
        ...geofencingZonesOptions,
        geofencingZones,
      }));
    },
    [setGeofencingZonesOptions]
  );

  useGeofencingZones(geofencingZonesOptions.enabled, onGeofencingZonesChanged);

  return (
    <div className="App">
      <div className="control-panel-wrapper">
        <ControlPanel
          statistics={statistics}
          options={options}
          setOptions={setOptions}
          filter={filter}
          setFilter={setFilter}
          geofencingZonesOptions={geofencingZonesOptions}
          setGeofencingZonesOptions={setGeofencingZonesOptions}
          loading={loading}
          refresh={refresh}
        />
      </div>
      <div className="map-wrapper">
        <Map
          vehicles={vehicles}
          stations={stations}
          viewState={viewState}
          setViewState={setViewState}
          radius={options.radius}
          mapStyle={options.mapStyle}
          geofencingZonesOptions={geofencingZonesOptions}
        />
      </div>
    </div>
  );
};
