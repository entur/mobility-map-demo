import React, { useState } from "react";
import { Map } from "../Map";
import "./App.scss";
import useMapData from "hooks/useMapData";
import { InitialViewStateProps } from "@deck.gl/core/lib/deck";
import { ControlPanel } from "components/ControlPanel";
import { Options } from "model/options";
import { Filter } from "model/filter";

const defaultOptions: Options = {
  radius: 2500,
  mapStyle: "ICONS",
};

const defaultFilter: Filter = {
  includeReserved: false,
  includeDisabled: false,
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
  const [viewState, setViewState] = useState<InitialViewStateProps>(
    INITIAL_VIEW_STATE
  );

  const { vehicles, statistics } = useMapData(
    viewState,
    options.radius!,
    filter
  );

  return (
    <div className="App">
      <div className="control-panel-wrapper">
        <ControlPanel
          statistics={statistics}
          options={options}
          setOptions={setOptions}
          filter={filter}
          setFilter={setFilter}
        />
      </div>
      <div className="map-wrapper">
        <Map
          vehicles={vehicles}
          viewState={viewState}
          setViewState={setViewState}
          radius={options.radius}
          mapStyle={options.mapStyle}
        />
      </div>
    </div>
  );
};
