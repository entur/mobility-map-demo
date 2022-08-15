import { EmphasizedText } from "@entur/typography";
import { Station, VehicleTypeAvailability } from "model/station";

type Props = {
  station: Station;
  full?: boolean;
};

export const StationTooltipContent = ({ station }: Props) => {
  return (
    <>
      <section style={{ textAlign: "left", minWidth: "100px" }}>
        <EmphasizedText>
          {station.system.name.translation[0].value} -{" "}
          {station.name.translation[0].value}
        </EmphasizedText>{" "}
        <br />
        <hr />
        <>
          {station.vehicleTypesAvailable.map(
            (v: VehicleTypeAvailability) =>
              (v.count && (
                <p>
                  {v.count} {v.vehicleType.name?.translation[0].value} (
                  {v.vehicleType.propulsionType
                    .split("_")
                    .join(" ")
                    .toLocaleLowerCase()}{" "}
                  {v.vehicleType.formFactor.toLocaleLowerCase()})
                </p>
              )) ||
              null
          )}
        </>
        ID: {station.id}
        <br />
      </section>
    </>
  );
};
