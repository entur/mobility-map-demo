import * as React from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
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

export const MapContainer = ({ vehicles, stations, onViewportChange }: MapContainerProps) => {
  const [viewState, setViewState] = React.useState({
    longitude: 10.75,
    latitude: 59.91,
    zoom: 13,
  });
  const [selected, setSelected] = React.useState<{ type: 'vehicle' | 'station'; id: string } | null>(null);

  // Find selected item details
  const selectedVehicle = selected?.type === 'vehicle' ? vehicles.find(v => v.id === selected.id) : null;
  const selectedStation = selected?.type === 'station' ? stations.find(s => s.id === selected.id) : null;


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
      mapLib={maplibregl}
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
          anchor="center"
        >
          <div
            className="marker-animation"
            style={{
              backgroundColor: vehicle.isDisabled ? '#ff0000' : vehicle.isReserved ? '#ffa500' : '#4CAF50',
              cursor: 'pointer',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: '2px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
            onClick={() => setSelected({ type: 'vehicle', id: vehicle.id })}
            title={vehicle.id}
          />
        </Marker>
      ))}
      {stations.map(station => (
        <Marker 
          key={station.id}
          longitude={station.lon} 
          latitude={station.lat} 
          anchor="center"
        >
          <div
            className="marker-animation"
            style={{
              backgroundColor: (!station.isInstalled || !station.isRenting) ? '#ff0000' : station.numBikesAvailable === 0 ? '#ffa500' : '#4CAF50',
              cursor: 'pointer',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: '2px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
            onClick={() => setSelected({ type: 'station', id: station.id })}
            title={station.id}
          />
        </Marker>
      ))}
      {selectedVehicle && (
        <Popup
          longitude={selectedVehicle.lon}
          latitude={selectedVehicle.lat}
          anchor="top"
          onClose={() => setSelected(null)}
          closeOnClick={false}
        >
          <div style={{ minWidth: 180 }}>
            <strong>Vehicle</strong><br />
            <div>ID: {selectedVehicle.id}</div>
            <div>Form: {selectedVehicle.vehicleType.formFactor}</div>
            <div>Propulsion: {selectedVehicle.vehicleType.propulsionType}</div>
            <div>Reserved: {selectedVehicle.isReserved ? 'Yes' : 'No'}</div>
            <div>Disabled: {selectedVehicle.isDisabled ? 'Yes' : 'No'}</div>
            <div>System: {selectedVehicle.system?.name?.translation?.[0]?.value || ''}</div>
          </div>
        </Popup>
      )}
      {selectedStation && (
        <Popup
          longitude={selectedStation.lon}
          latitude={selectedStation.lat}
          anchor="top"
          onClose={() => setSelected(null)}
          closeOnClick={false}
        >
          <div style={{ minWidth: 180 }}>
            <strong>Station</strong><br />
            <div>ID: {selectedStation.id}</div>
            <div>Name: {selectedStation.name?.translation?.[0]?.value || ''}</div>
            <div>Bikes: {selectedStation.numBikesAvailable}</div>
            <div>Docks: {selectedStation.numDocksAvailable}</div>
            <div>Capacity: {selectedStation.capacity}</div>
            <div>Installed: {selectedStation.isInstalled ? 'Yes' : 'No'}</div>
            <div>Renting: {selectedStation.isRenting ? 'Yes' : 'No'}</div>
            <div>Returning: {selectedStation.isReturning ? 'Yes' : 'No'}</div>
          </div>
        </Popup>
      )}
    </Map>
  );
};

// Add marker pop-in/out animation and marker style
// Add these styles to your CSS (e.g., in App.css or a dedicated CSS file)
/*
.custom-marker {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  border: 2px solid #fff;
  transition: transform 0.3s cubic-bezier(.68,-0.55,.27,1.55), opacity 0.3s;
}
.marker-pop-enter {
  opacity: 0;
  transform: scale(0.5);
}
.marker-pop-enter-active {
  opacity: 1;
  transform: scale(1);
}
.marker-pop-exit {
  opacity: 1;
  transform: scale(1);
}
.marker-pop-exit-active {
  opacity: 0;
  transform: scale(0.5);
}
*/

