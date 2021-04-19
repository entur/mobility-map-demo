import React, { memo } from "react";
import { Contrast } from "@entur/layout";
import { Statistics } from "model/statistics";
import { Options } from "model/options";
import { StatisticsList } from "./StatisticsList";
import { OptionsForm } from "./OptionsForm";
import logo from "static/img/logo.png";
import "./ControlPanel.scss";
import { Filter } from "model/filter";
import { FiltersForm } from "./FiltersForm";
import { PrimaryButton } from "@entur/button";

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
