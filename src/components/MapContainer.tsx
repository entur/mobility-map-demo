import * as React from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Vehicle, Station, MapMode } from '../types';

interface MapContainerProps {
  vehicles: Vehicle[];
  stations: Station[];
  mode: MapMode;
  onViewportChange: (bounds: {
    minimumLatitude: number;
    maximumLatitude: number;
    minimumLongitude: number;
    maximumLongitude: number;
  }) => void;
}



const OSM_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
} as any;

export const MapContainer = ({ vehicles, stations, mode, onViewportChange }: MapContainerProps) => {
  const [viewState, setViewState] = React.useState({
    longitude: 10.75,
    latitude: 59.91,
    zoom: 13,
  });

  const handleMove = React.useCallback((evt: any) => {
    setViewState(evt.viewState);
    const bounds = evt.target.getBounds();
    if (bounds) {
      onViewportChange({
        minimumLatitude: bounds.getSouth(),
        maximumLatitude: bounds.getNorth(),
        minimumLongitude: bounds.getWest(),
        maximumLongitude: bounds.getEast(),
      });
    }
  }, [onViewportChange]);

  return (
    <Map
      mapLib={import('maplibre-gl')}
      initialViewState={viewState}
      mapStyle={OSM_STYLE}
      style={{ width: '100%', height: '100%' }}
      onMove={handleMove}
    >
      <NavigationControl position="top-left" />
      {vehicles.map(vehicle => (
        <Marker
          key={vehicle.id}
          longitude={vehicle.lon}
          latitude={vehicle.lat}
          color={vehicle.isDisabled ? '#ff0000' : vehicle.isReserved ? '#ffa500' : '#4CAF50'}
        />
      ))}
      {stations.map(station => (
        <Marker
          key={station.id}
          longitude={station.lon}
          latitude={station.lat}
          color={(!station.isInstalled || !station.isRenting) ? '#ff0000' : station.numBikesAvailable === 0 ? '#ffa500' : '#4CAF50'}
        />
      ))}
    </Map>
  );
};

