import React from "react";
import { Icon, Tooltip } from "antd";

const ActionButtons = props => (
  <div className="play-action">
    <Tooltip placement="top" title={"Replay"}>
      <Icon
        type="step-backward"
        onClick={() => props.onAngleButtonClick(false)}
      />
    </Tooltip>
    <Tooltip placement="top" title={"Play"}>
      <Icon
        id="ActionBtnPlay"
        type={props.isPlaying ? "pause-circle" : "caret-right"}
        onClick={() => props.onPlayButtonClick()}
      />
    </Tooltip>
    <Tooltip placement="top" title={"Next"}>
      <Icon
        type="step-forward"
        onClick={() => props.onAngleButtonClick(true)}
      />
    </Tooltip>
  </div>
);

export default ActionButtons;
