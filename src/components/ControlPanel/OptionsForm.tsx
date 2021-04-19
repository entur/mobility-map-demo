import { memo } from "react";
import {
  MultipleSegmentedControl,
  SegmentedChoice,
  TextField,
} from "@entur/form";
import { Heading4 } from "@entur/typography";
import { Options, SystemType } from "model/options";
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
        <SegmentedChoice value="HEATMAP">Heatmap</SegmentedChoice>
        <SegmentedChoice value="ICONS">Icons</SegmentedChoice>
      </SegmentedControl>
      <MultipleSegmentedControl
        label="System types"
        onChange={(systemTypes) => {
          setOptions({
            ...options,
            systemTypes: systemTypes as Record<SystemType, boolean>,
          });
        }}
        selectedValue={options.systemTypes}
      >
        <SegmentedChoice value={SystemType.DOCKED}>Docked</SegmentedChoice>
        <SegmentedChoice value={SystemType.FREEFLOATING}>
          Free floating
        </SegmentedChoice>
      </MultipleSegmentedControl>

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
