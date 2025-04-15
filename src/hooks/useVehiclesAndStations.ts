import { useEffect, useRef, useState } from 'react';
import { fetchGraphQL } from '../graphql/fetchGraphQL';
import { createGraphQLWSClient, subscribeToUpdates } from '../graphql/graphqlWsClient';
import { Vehicle, Station } from '../types';

const GRAPHQL_HTTP_URL = 'http://localhost:8080/graphql';
const GRAPHQL_WS_URL = 'ws://localhost:8080/subscriptions';

const VEHICLES_SUBSCRIPTION = `
  subscription Vehicles($minimumLatitude: Float!, $maximumLatitude: Float!, $minimumLongitude: Float!, $maximumLongitude: Float!) {
    vehicles(
      minimumLatitude: $minimumLatitude,
      maximumLatitude: $maximumLatitude,
      minimumLongitude: $minimumLongitude,
      maximumLongitude: $maximumLongitude
    ) {
      vehicleId
      updateType
      vehicle {
        id
        lat
        lon
        system { name { translation { value language } } operator { id name { translation { value language } } } }
        vehicleType { formFactor propulsionType }
        isReserved
        isDisabled
      }
    }
  }
`;

const STATIONS_SUBSCRIPTION = `
  subscription Stations($minimumLatitude: Float!, $maximumLatitude: Float!, $minimumLongitude: Float!, $maximumLongitude: Float!) {
    stations(
      minimumLatitude: $minimumLatitude,
      maximumLatitude: $maximumLatitude,
      minimumLongitude: $minimumLongitude,
      maximumLongitude: $maximumLongitude
    ) {
      stationId
      updateType
      station {
        id
        name { translation { value language } }
        lat
        lon
        system { name { translation { value language } } operator { id name { translation { value language } } } }
        numBikesAvailable
        numDocksAvailable
        capacity
        isInstalled
        isRenting
        isReturning
        isVirtualStation
      }
    }
  }
`;

export function useVehiclesAndStations(
  bounds: { minimumLatitude: number; maximumLatitude: number; minimumLongitude: number; maximumLongitude: number; },
  mode: 'vehicles' | 'stations'
) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting'|'connected'|'disconnected'>('connecting');
  const [updateStats, setUpdateStats] = useState({ vehicles: 0, stations: 0 });

  const wsClientRef = useRef<any>(null);

  // Reset lists when subscription changes (mode or bounds)
  useEffect(() => {
    setVehicles([]);
    setStations([]);
  }, [mode, bounds.minimumLatitude, bounds.maximumLatitude, bounds.minimumLongitude, bounds.maximumLongitude]);

  useEffect(() => {
    const client = createGraphQLWSClient({ url: GRAPHQL_WS_URL });
    wsClientRef.current = client;
    setConnectionStatus('connecting');

    let unsub: (() => void) | undefined;

    if (mode === 'vehicles') {
      unsub = subscribeToUpdates(
        client,
        { query: VEHICLES_SUBSCRIPTION, variables: bounds },
        (data: any) => {
          if (data?.vehicles) {
            setVehicles(prev => updateVehicleArray(prev, data.vehicles));
            setUpdateStats(stats => ({ ...stats, vehicles: stats.vehicles + 1 }));
            console.log('[Vehicle Update]', data.vehicles);
          }
        },
        (err) => { setConnectionStatus('disconnected'); console.error(err); },
        () => { setConnectionStatus('disconnected'); }
      );
    } else if (mode === 'stations') {
      unsub = subscribeToUpdates(
        client,
        { query: STATIONS_SUBSCRIPTION, variables: bounds },
        (data: any) => {
          if (data?.stations) {
            setStations(prev => updateStationArray(prev, data.stations));
            setUpdateStats(stats => ({ ...stats, stations: stats.stations + 1 }));
            console.log('[Station Update]', data.stations);
          }
        },
        (err) => { setConnectionStatus('disconnected'); console.error(err); },
        () => { setConnectionStatus('disconnected'); }
      );
    }

    setConnectionStatus('connected');

    return () => {
      unsub && unsub();
      client.dispose();
    };
  }, [bounds.minimumLatitude, bounds.maximumLatitude, bounds.minimumLongitude, bounds.maximumLongitude, mode]);

  return { vehicles, stations, connectionStatus, updateStats };
}

// Utility to update array by id, handling create/update/delete for VehicleUpdate
function updateVehicleArray(arr: Vehicle[], updates: any[]): Vehicle[] {
  let newArr = [...arr];
  for (const update of updates) {
    const { updateType, vehicleId, vehicle } = update;
    if (updateType === 'DELETE') {
      newArr = newArr.filter(item => item.id !== vehicleId);
    } else if (vehicle) {
      const idx = newArr.findIndex(item => item.id === vehicleId);
      if (idx === -1) newArr.push(vehicle);
      else newArr[idx] = { ...newArr[idx], ...vehicle };
    }
  }
  return newArr;
}

// Utility to update array by id, handling create/update/delete for StationUpdate
function updateStationArray(arr: Station[], updates: any[]): Station[] {
  let newArr = [...arr];
  for (const update of updates) {
    const { updateType, stationId, station } = update;
    if (updateType === 'DELETE') {
      newArr = newArr.filter(item => item.id !== stationId);
    } else if (station) {
      const idx = newArr.findIndex(item => item.id === stationId);
      if (idx === -1) newArr.push(station);
      else newArr[idx] = { ...newArr[idx], ...station };
    }
  }
  return newArr;
}