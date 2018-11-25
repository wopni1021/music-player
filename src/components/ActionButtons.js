import React from "react";
import { Icon } from "antd";

const ActionButtons = (
  props
) => (
  <div className="play-action">
    <Icon type="step-backward" onClick={() => props.onAngelButtonClick(false)} />
    <Icon
      id="ActionBtnPlay"
      type={props.isPlaying ? "pause-circle" : "caret-right"}
      onClick={() => props.onPlayButtonClick()}
    />

    <Icon type="step-forward" onClick={() => props.onAngelButtonClick(true)} />
    {/* {props.isShuffle ? (
      <i className="material-icons" onClick={() => props.onModeButtonClick(false)}>
        shuffle
      </i>
    ) : (
      <Icon type="retweet" onClick={() => props.onModeButtonClick(true)} />
    )} */}
  </div>
);

export default ActionButtons;
