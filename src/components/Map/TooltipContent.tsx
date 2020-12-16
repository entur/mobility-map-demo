import { useEffect, useState } from "react";
import { TertiaryButton } from "@entur/button";
import { EmphasizedText } from "@entur/typography";
import { differenceInSeconds, parseISO } from "date-fns";

const getLastUpdated = (lastUpdated: string): number =>
  differenceInSeconds(new Date(), parseISO(lastUpdated));

export const TooltipContent = ({ vehicle, full = false }: any) => {
  const [lastUpdated, setLastUpdated] = useState<number>(
    getLastUpdated(vehicle.lastUpdated)
  );

  useEffect(() => {
    let interval = setInterval(() => {
      setLastUpdated(getLastUpdated(vehicle.lastUpdated));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  const scheduleInfo =
    vehicle.delay === 0
      ? "On schedule"
      : `${Math.abs(vehicle.delay)} seconds ${
          vehicle.delay < 0 ? "ahead of" : "behind"
        } schedule`;

  return (
    <section style={{ textAlign: "left", minWidth: "100px", zIndex: 1000 }}>
      <EmphasizedText>{vehicle.line.lineRef}</EmphasizedText> (
      {vehicle.line.lineName})<br />
      <hr />
      {scheduleInfo}
      <br />
      {lastUpdated && <>Last updated {lastUpdated} seconds ago</>}
      {full && (
        <>
          <br />
          <hr />
          Vehicle ID: {vehicle.vehicleRef}
          <br />
          Service journey ID: {vehicle.serviceJourney.serviceJourneyId}
          <br />
          Operator ref: {vehicle.operator.operatorRef}
          <br />
          <hr />
          <TertiaryButton
            onClick={() =>
              navigator.clipboard.writeText(JSON.stringify(vehicle, null, 2))
            }
          >
            Copy vehicle JSON
          </TertiaryButton>
        </>
      )}
    </section>
  );
};