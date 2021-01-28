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
        label="Choose map style"
        onChange={(selectedValue) =>
          setOptions({ ...options, mapStyle: selectedValue })
        }
        selectedValue={options.mapStyle}
      >
        <SegmentedChoice value="HEATMAP">Heatmap</SegmentedChoice>
        <SegmentedChoice value="ICONS">Icons</SegmentedChoice>
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
