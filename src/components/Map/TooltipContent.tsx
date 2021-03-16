import { EmphasizedText } from "@entur/typography";
import { Vehicle } from "model/vehicle";

type Props = {
  vehicle: Vehicle;
  full?: boolean;
};

export const TooltipContent = ({ vehicle }: Props) => {
  return (
    <>
      <section style={{ textAlign: "left", minWidth: "100px", zIndex: 1000 }}>
        <EmphasizedText>{vehicle.system.name}</EmphasizedText> (
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
        Price: {vehicle.pricingPlan.description}
        <br />
      </section>
    </>
  );
};
