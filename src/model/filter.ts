import { Codespace } from "./codespace";
import { FormFactor, PropulsionType } from "./vehicle";

export type Filter = {
  codespaces?: Codespace[];
  operators?: string[];
  formFactors?: FormFactor[];
  propulsionTypes?: PropulsionType[];
  includeReserved?: boolean;
  includeDisabled?: boolean;
};
