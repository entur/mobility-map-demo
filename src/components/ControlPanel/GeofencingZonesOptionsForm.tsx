import { memo } from "react";
import { Switch } from "@entur/form";
import { Heading4 } from "@entur/typography";
import { MultiSelect } from "@entur/dropdown";
import { GeofencingZonesOptions } from "model/geofencingZonesOptions";
import { GeofencingZone } from "model/geofencingZone";
import { DROPDOWN_DEFAULT_VALUE } from "./constants";

type Props = {
  options: GeofencingZonesOptions;
  setOptions: (options: GeofencingZonesOptions) => void;
};

export const GeofencingZonesOptionsForm = memo(
  ({ options, setOptions }: Props) => {
    return (
      <>
        <Heading4>Geofencing zones</Heading4>
        <Switch
          onChange={(e) => {
            setOptions({
              ...options,
              enabled: e.target.checked,
            });
          }}
        >
          Show geofencing zones
        </Switch>
        <MultiSelect
          disabled={!options.enabled}
          items={() =>
            options.geofencingZones.map((v: GeofencingZone) => ({
              label: v.systemId,
              value: v.systemId,
            }))
          }
          selectedItem={options.selectedGeofencingZones}
          label="Systems"
          placeholder={DROPDOWN_DEFAULT_VALUE}
          onSelectedItemsChange={(e: any) => {
            setOptions({
              ...options,
              selectedGeofencingZones: e.selectedItems.map((v: any) => v.value),
            });
          }}
        />
      </>
    );
  }
);
