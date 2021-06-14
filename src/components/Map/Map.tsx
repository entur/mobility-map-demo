import DeckGL from "@deck.gl/react";
import { IconLayer, ScatterplotLayer } from "@deck.gl/layers";
import {
  Popup,
  StaticMap,
  _MapContext as MapContext,
  Marker,
} from "react-map-gl";
import { VehicleMapPoint } from "model/vehicleMapPoint";
import iconAtlas from "static/icons/icons.png";
import iconMapping from "static/icons/icons.json";
import "mapbox-gl/dist/mapbox-gl.css";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { useState } from "react";
import { PickInfo } from "@deck.gl/core/lib/deck";
import { Vehicle } from "model/vehicle";
import { TooltipContent } from "./TooltipContent";
import { StationMapPoint } from "model/stationMapPoint";
import { HeatmapPoint } from "model/heatmapPoint";
import { GeofencingZone, Feature } from "model/geofencingZone";
import { GeoJsonLayer } from "@deck.gl/layers";
import { RGBAColor } from "deck.gl";

const DEFAULT_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const MAPBOX_MAP_STYLE = process.env.REACT_APP_MAPBOX_MAP_STYLE;

const getFillColor = (rules: any): RGBAColor => {
  if (rules.some((rule: any) => rule.maximumSpeedKph)) {
    return [228, 255, 26, 50];
  }

  if (
    rules.some((rule: any) => !rule.rideAllowed && !rule.rideThroughAllowed)
  ) {
    return [255, 87, 20, 50];
  }

  if (rules.some((rule: any) => !rule.rideAllowed && rule.rideThroughAllowed)) {
    return [255, 184, 0, 50];
  }

  if (rules.some((rule: any) => rule.rideAllowed && rule.rideThroughAllowed)) {
    return [190, 190, 50, 50];
  }

  return [255, 255, 255, 0];
};

export const Map = ({
  vehicles,
  stations,
  viewState,
  setViewState,
  radius,
  mapStyle,
  geofencingZonesOptions,
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
    const points: HeatmapPoint[] = [
      ...Object.values(vehicles).map((v: any) => ({
        id: v.vehicle.id,
        lat: v.vehicle.lat,
        lon: v.vehicle.lon,
        available: 1,
      })),
      ...Object.values(stations).map((s: any) => ({
        id: s.station.id,
        lat: s.station.lat,
        lon: s.station.lon,
        available: s.station.numBikesAvailable,
      })),
    ];

    layers.push(
      new HeatmapLayer<HeatmapPoint>({
        id: "heatmap-layer",
        data: points,
        getPosition: (d) => [d.lon, d.lat],
        getWeight: (d) => d.available,
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
    layers.push(
      new IconLayer<StationMapPoint>({
        id: "station-layer",
        data: Object.values(stations),
        pickable: false,
        iconAtlas,
        iconMapping,
        getIcon: (d: StationMapPoint) => d.icon,
        getSize: (d: StationMapPoint) => 50,
        getPosition: (stationMapPoint: StationMapPoint) => [
          stationMapPoint.station.lon,
          stationMapPoint.station.lat,
        ],
      })
    );
  }

  if (geofencingZonesOptions.enabled) {
    geofencingZonesOptions.geofencingZones.forEach(
      (geofencingZone: GeofencingZone) => {
        if (
          geofencingZonesOptions.selectedGeofencingZones.includes(
            geofencingZone.systemId
          )
        ) {
          layers.push(
            new GeoJsonLayer<Feature>({
              id: `geojson-layer-${geofencingZone.systemId}`,
              data: geofencingZone.geojson as any,
              filled: true,
              extruded: false,
              stroked: true,
              pickable: true,
              getLineWidth: 10,
              getFillColor: (d) => getFillColor(d.properties.rules),
            })
          );
        }
      }
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
        {mapStyle === "ICONS" &&
          Object.values(stations).map((stationMapPoint: any) => {
            return (
              <Marker
                key={stationMapPoint.station.id}
                latitude={stationMapPoint.station.lat}
                longitude={stationMapPoint.station.lon}
              >
                <p>{stationMapPoint.station.numBikesAvailable}</p>
              </Marker>
            );
          })}
        {hoverInfo && (
          <Popup
            key="hover"
            closeButton={false}
            longitude={hoverInfo.lon}
            latitude={hoverInfo.lat}
            anchor="bottom"
          >
            <TooltipContent vehicle={hoverInfo} />
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
