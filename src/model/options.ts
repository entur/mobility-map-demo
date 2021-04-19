export enum SystemType {
  DOCKED,
  FREEFLOATING,
}

export type Options = {
  radius?: number;
  mapStyle: string | null;
  systemTypes: Record<SystemType, boolean>;
};
