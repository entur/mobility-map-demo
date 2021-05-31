import { PrimaryButton } from "@entur/button";
import { Contrast } from "@entur/layout";
import { Link, SubParagraph } from "@entur/typography";
import { Filter } from "model/filter";
import { Options } from "model/options";
import { Statistics } from "model/statistics";
import { memo } from "react";
import logo from "static/img/logo.png";
import "./ControlPanel.scss";
import { FiltersForm } from "./FiltersForm";
import { OptionsForm } from "./OptionsForm";
import { StatisticsList } from "./StatisticsList";

type Props = {
  statistics: Statistics;
  options: Options;
  setOptions: (options: Options) => void;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  loading: boolean;
  refresh: () => void;
};

export const ControlPanel = memo((props: Props) => {
  return (
    <Contrast>
      <div className="logo-wrapper">
        <img className="logo" src={logo} alt="Entur logo" />
        <span>Mobility Map Demo</span>
        <SubParagraph>
          This is a technical demonstration of{" "}
          <Link href="https://developer.entur.org/pages-mobility-docs-mobility-v2">
            Entur's National Mobility API
          </Link>
          , showing available vehicles for participating operators.
        </SubParagraph>
      </div>

      <div className="control-panel-content">
        <PrimaryButton loading={props.loading} onClick={() => props.refresh()}>
          Refresh data
        </PrimaryButton>
      </div>

      <div className="control-panel-content">
        <StatisticsList statistics={props.statistics} />
      </div>

      <div className="control-panel-content">
        <OptionsForm options={props.options} setOptions={props.setOptions} />
      </div>

      <div className="control-panel-content">
        <FiltersForm filter={props.filter} setFilter={props.setFilter} />
      </div>
    </Contrast>
  );
});
