import React from "react";
import { Icon } from "antd";

const ActionButtons = props => (
  <div className="play-action">
    <Icon
      type="step-backward"
      onClick={() => props.onAngelButtonClick(false)}
    />
    <Icon
      id="ActionBtnPlay"
      type={props.isPlaying ? "pause-circle" : "caret-right"}
      onClick={() => props.onPlayButtonClick()}
    />

    <Icon type="step-forward" onClick={() => props.onAngelButtonClick(true)} />
  </div>
);

export default ActionButtons;
