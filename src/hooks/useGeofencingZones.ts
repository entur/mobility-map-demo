import { useQuery } from "@apollo/client";
import { GEOFENCING_ZONES_QUERY } from "api/graphql";
import { GeofencingZone } from "model/geofencingZone";
import { useEffect } from "react";

export default function useGeofencingZones(
  enabled: boolean,
  setGeofencingZones: (geofencingZones: GeofencingZone[]) => void
) {
  const { data: geofencingZonesData } = useQuery(GEOFENCING_ZONES_QUERY, {
    skip: !enabled,
    fetchPolicy: "cache-first",
  });

  useEffect(() => {
    if (enabled) {
      setGeofencingZones(
        (geofencingZonesData?.geofencingZones || []) as GeofencingZone[]
      );
    }
  }, [geofencingZonesData?.geofencingZones, setGeofencingZones, enabled]);
}
