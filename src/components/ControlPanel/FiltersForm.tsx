import { memo } from "react";
import { MultiSelect } from "@entur/dropdown";
import { Heading4 } from "@entur/typography";
import { Switch } from "@entur/form";
import useCodespaces from "hooks/useCodespaces";
import { Filter } from "model/filter";
import { DROPDOWN_DEFAULT_VALUE } from "./constants";
import useOperators from "hooks/useOperators";
import { Operator } from "model/operator";
import { FormFactor, PropulsionType } from "model/vehicle";

type Props = {
  filter: Filter;
  setFilter: (filter: Filter) => void;
};

export const FiltersForm = memo(({ filter, setFilter }: Props) => {
  const codespaces = useCodespaces();
  const operators = useOperators();

  return (
    <>
      <Heading4>Filters</Heading4>
      <MultiSelect
        items={() => codespaces.map((v: string) => ({ label: v, value: v }))}
        selectedItem={filter.codespaces}
        label="Codespaces"
        placeholder={DROPDOWN_DEFAULT_VALUE}
        onSelectedItemsChange={(e: any) => {
          const { codespaces, ...rest } = filter;
          if (e.selectedItems.length === 0) {
            setFilter({
              ...rest,
            });
          } else {
            setFilter({
              ...rest,
              codespaces: e.selectedItems?.map((item: any) => item.value),
            });
          }
        }}
      />
      <MultiSelect
        items={() =>
          operators.map((v: Operator) => ({
            label: `${v.name} (${v.codespace})`,
            value: v.name,
          }))
        }
        selectedItem={filter.operators}
        label="Operators"
        placeholder={DROPDOWN_DEFAULT_VALUE}
        onSelectedItemsChange={(e: any) => {
          const { operators, ...rest } = filter;
          if (e.selectedItems.length === 0) {
            setFilter({
              ...rest,
            });
          } else {
            setFilter({
              ...rest,
              operators: e.selectedItems?.map((item: any) => item.value),
            });
          }
        }}
      />
      <MultiSelect
        items={() =>
          Object.keys(FormFactor).map((v: string) => ({ label: v, value: v }))
        }
        selectedItem={filter.formFactors}
        label="Form factors"
        placeholder={DROPDOWN_DEFAULT_VALUE}
        onSelectedItemsChange={(e: any) => {
          const { formFactors, ...rest } = filter;
          if (e.selectedItems.length === 0) {
            setFilter({
              ...rest,
            });
          } else {
            setFilter({
              ...rest,
              formFactors: e.selectedItems?.map((item: any) => item.value),
            });
          }
        }}
      />
      <MultiSelect
        items={() =>
          Object.keys(PropulsionType).map((v: string) => ({
            label: v,
            value: v,
          }))
        }
        selectedItem={filter.propulsionTypes}
        label="Propulsion types"
        placeholder={DROPDOWN_DEFAULT_VALUE}
        onSelectedItemsChange={(e: any) => {
          const { propulsionTypes, ...rest } = filter;
          if (e.selectedItems.length === 0) {
            setFilter({
              ...rest,
            });
          } else {
            setFilter({
              ...rest,
              propulsionTypes: e.selectedItems?.map((item: any) => item.value),
            });
          }
        }}
      />
      <Switch
        checked={filter.includeReserved}
        onChange={(event) => {
          setFilter({
            ...filter,
            includeReserved: event.target.checked,
          });
        }}
      >
        Include reserved
      </Switch>
      <Switch
        checked={filter.includeDisabled}
        onChange={(event) => {
          setFilter({
            ...filter,
            includeDisabled: event.target.checked,
          });
        }}
      >
        Include disabled
      </Switch>
    </>
  );
});
