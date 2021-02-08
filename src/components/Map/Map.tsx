import DeckGL from "@deck.gl/react";
import { IconLayer, ScatterplotLayer } from "@deck.gl/layers";
import { Popup, StaticMap, _MapContext as MapContext } from "react-map-gl";
import { VehicleMapPoint } from "model/vehicleMapPoint";
import iconAtlas from "static/icons/icons.png";
import iconMapping from "static/icons/icons.json";
import "mapbox-gl/dist/mapbox-gl.css";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { useState } from "react";
import { PickInfo } from "@deck.gl/core/lib/deck";
import { Vehicle } from "model/vehicle";

const DEFAULT_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const MAPBOX_MAP_STYLE = process.env.REACT_APP_MAPBOX_MAP_STYLE;

export const Map = ({
  vehicles,
  viewState,
  setViewState,
  radius,
  mapStyle,
}: any) => {
  const [hoverInfo, setHoverInfo] = useState<Vehicle | null>(null);

  const layers: any = [
    new ScatterplotLayer({
      id: "coverage-radius",
      data: [{ position: [viewState.longitude, viewState.latitude] }],
      pickable: false,
      opacity: 0.1,
      stroked: true,
      filled: false,
      lineWidthMinPixels: 1,
      getPosition: (d: any) => d.position,
      getRadius: (d) => radius,
      getFillColor: (d) => [0, 0, 0],
      getLineColor: (d) => [0, 0, 0],
    }),
  ];

  if (mapStyle === "HEATMAP") {
    layers.push(
      new HeatmapLayer<VehicleMapPoint>({
        id: "heatmap-layer",
        data: Object.values(vehicles),
        getPosition: (d) => [d.vehicle.lon, d.vehicle.lat],
      })
    );
  } else if (mapStyle === "ICONS") {
    layers.push(
      new IconLayer<VehicleMapPoint>({
        id: "icon-layer",
        data: Object.values(vehicles),
        pickable: true,
        iconAtlas,
        iconMapping,
        getIcon: (d: VehicleMapPoint) => d.icon,
        getSize: () => 25,
        getPosition: (vehicleMapPoint: VehicleMapPoint) => [
          vehicleMapPoint.vehicle.lon,
          vehicleMapPoint.vehicle.lat,
        ],
        onHover: (info: PickInfo<VehicleMapPoint>) =>
          setHoverInfo(info?.object?.vehicle),
      })
    );
  }

  return (
    <>
      <DeckGL
        ContextProvider={MapContext.Provider}
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        controller={true}
        layers={layers}
        style={{ left: "400px", width: "calc(100% - 400px)" }}
      >
        {hoverInfo && (
          <Popup
            key="hover"
            closeButton={false}
            longitude={hoverInfo.lon}
            latitude={hoverInfo.lat}
            anchor="bottom"
          >
            {hoverInfo.id}
          </Popup>
        )}
        <StaticMap
          key="map"
          width="100%"
          height="100%"
          reuseMaps
          preventStyleDiffing
          {...(!!MAPBOX_MAP_STYLE && !!MAPBOX_ACCESS_TOKEN
            ? {
                mapStyle: MAPBOX_MAP_STYLE,
                mapboxApiAccessToken: MAPBOX_ACCESS_TOKEN,
              }
            : { mapStyle: DEFAULT_STYLE })}
        />
      </DeckGL>
    </>
  );
};
