import { GeofencingZone } from "./geofencingZone";

export type GeofencingZonesOptions = {
  enabled: boolean;
  selectedGeofencingZones: string[];
  geofencingZones: GeofencingZone[];
};
