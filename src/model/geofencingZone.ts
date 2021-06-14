export type GeofencingZone = {
  systemId: string;
  geojson: FeatureCollection;
};

export type FeatureCollection = {
  features: Feature[];
};

export type Feature = {
  geometry: MultiPolygon;
  properties: any;
};

export type MultiPolygon = {
  coordinates: [[[[number]]]];
};
