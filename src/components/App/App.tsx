import React, { useState } from "react";
import { Map } from "../Map";
import "./App.scss";
import useMapData from "hooks/useMapData";
import { InitialViewStateProps } from "@deck.gl/core/lib/deck";
import { ControlPanel } from "components/ControlPanel";
import { Options } from "model/options";

const defaultOptions: Options = {
  radius: 30000,
  mapStyle: "HEATMAP",
};

// Viewport settings
const INITIAL_VIEW_STATE: InitialViewStateProps = {
  longitude: 10.757933,
  latitude: 59.911491,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};

export const App = () => {
  const [options, setOptions] = useState<Options>(defaultOptions);
  const [viewState, setViewState] = useState<InitialViewStateProps>(
    INITIAL_VIEW_STATE
  );

  const { vehicles, statistics } = useMapData(viewState, options.radius!);

  return (
    <div className="App">
      <div className="control-panel-wrapper">
        <ControlPanel
          statistics={statistics}
          options={options}
          setOptions={setOptions}
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
