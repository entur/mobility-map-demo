import { EmphasizedText } from "@entur/typography";
import { Vehicle } from "model/vehicle";

type Props = {
  vehicle: Vehicle;
  full?: boolean;
};

export const VehicleTooltipContent = ({ vehicle }: Props) => {
  return (
    <>
      <section style={{ textAlign: "left", minWidth: "100px" }}>
        <EmphasizedText>
          {vehicle.system.name.translation[0].value}
        </EmphasizedText>{" "}
        (
        {vehicle.vehicleType.propulsionType
          .split("_")
          .join(" ")
          .toLocaleLowerCase()}{" "}
        {vehicle.vehicleType.formFactor.toLocaleLowerCase()}
        )<br />
        <hr />
        Range:{" "}
        {vehicle.currentRangeMeters
          ? `${(vehicle.currentRangeMeters / 1000).toLocaleString(undefined, {
              maximumFractionDigits: 1,
            })}km`
          : "No data"}
        <br />
        {vehicle.isReserved && (
          <>
            <b>This vehicle is reserved</b>
            <br />
          </>
        )}
        {vehicle.isDisabled && (
          <>
            <b>This vehicle is disabled</b>
            <br />
          </>
        )}
        Price: {vehicle.pricingPlan.description.translation[0].value}
        <br />
        ID: {vehicle.id}
        <br />
      </section>
    </>
  );
};
