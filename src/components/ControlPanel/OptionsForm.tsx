import { memo } from "react";
import { SegmentedChoice, TextField } from "@entur/form";
import { Heading4 } from "@entur/typography";
import { Options } from "model/options";
import { SegmentedControl } from "@entur/form";

type Props = {
  options: Options;
  setOptions: (options: Options) => void;
};

export const OptionsForm = memo(({ options, setOptions }: Props) => {
  return (
    <>
      <Heading4>Options</Heading4>
      <SegmentedControl
        label="Choose visualization"
        onChange={(selectedValue) =>
          setOptions({ ...options, mapStyle: selectedValue })
        }
        selectedValue={options.mapStyle}
      >
        <SegmentedChoice value="VEHICLE_HEATMAP">
          Vehicle heatmap
        </SegmentedChoice>
        <SegmentedChoice value="VEHICLE_ICONS">Vehicle icons</SegmentedChoice>
        <SegmentedChoice value="STATIONS">Vehicle stations</SegmentedChoice>
      </SegmentedControl>
      <TextField
        type="number"
        label="Radius (in meters)"
        value={options.radius}
        onChange={(event) =>
          setOptions({
            ...options,
            radius: parseInt(event.target.value),
          })
        }
      />
    </>
  );
});
