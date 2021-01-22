import React, { memo } from "react";
import { Contrast } from "@entur/layout";
import { Statistics } from "model/statistics";
import { Options } from "model/options";
import { StatisticsList } from "./StatisticsList";
import { OptionsForm } from "./OptionsForm";
import logo from "static/img/logo.png";
import "./ControlPanel.scss";

type Props = {
  statistics: Statistics;
  options: Options;
  setOptions: (options: Options) => void;
};

export const ControlPanel = memo((props: Props) => {
  return (
    <Contrast>
      <div className="logo-wrapper">
        <img className="logo" src={logo} alt="Entur logo" />
        <span>Mobility Map Demo</span>
      </div>

      <div className="control-panel-content">
        <StatisticsList statistics={props.statistics} />
      </div>

      <div className="control-panel-content">
        <OptionsForm options={props.options} setOptions={props.setOptions} />
      </div>
    </Contrast>
  );
});
