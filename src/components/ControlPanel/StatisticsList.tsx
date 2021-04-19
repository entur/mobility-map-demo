import { Heading4, ListItem, UnorderedList } from "@entur/typography";
import { Statistics } from "model/statistics";
import { memo } from "react";

type Props = {
  statistics: Statistics;
};
export const StatisticsList = memo(({ statistics }: Props) => {
  return (
    <>
      <Heading4>Statistics</Heading4>
      <UnorderedList>
        <ListItem>
          Number of free floating vehicles: {statistics.numberOfVehicles}
        </ListItem>
        <ListItem>
          Number of docking stations: {statistics.numberOfStations}
        </ListItem>
      </UnorderedList>
    </>
  );
});
