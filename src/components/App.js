import React, { Component } from "react";
import _ from "lodash";
import "antd/lib/icon/style/css";
import Preview from "./Preview";
import PlayList from "./PlayList";
import ActionButtons from "./ActionButtons";
import data from "../data";
import "./App.css";
import "antd/lib/slider/style/css";
import "antd/lib/popover/style/css";
import "antd/lib/message/style/css";

import { Slider, Popover, message } from "antd";

class App extends Component {
  constructor(props) {
    super(props);

    this.data = data;
    this.dataLength = data.length;
    this.peekMax = 40; // the max number in the slider for user to choose, default = 20
    this.peekMin = 1; // the min number user can choose to view in the page, default = 1

    this.state = {
      showPreview: false,
      isPlaying: false,
      currentSong: null,
      peekNo: 6, // initial state, can be defined by user

      peekQueueArr: [], //songs to be played, displayed in the playlist, the first song is the next one to play
      backupArr: [] // songs not displayed but will be used to replenish peekQueue
    };

    this.onPlayButtonClick = this.onPlayButtonClick.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onAngleButtonClick = this.onAngleButtonClick.bind(this);
    this.togglePreview = this.togglePreview.bind(this);
    this.shiftList = this.shiftList.bind(this);
    this.handleAudioPlay = this.handleAudioPlay.bind(this);
    this.getNextSong = this.getNextSong.bind(this);
  }

  componentDidMount() {
    if (!this.dataLength || this.dataLength <= 0) {
      return;
    }
    // set peekQueue
    const noOfLoop = _.ceil(this.state.peekNo / this.dataLength); // number of loops needed to build peekQueue
    let array = [];
    for (let i = 0; i < noOfLoop; i++) {
      array = array.concat(this.rearrangeSongs(this.data));
    }

    this.lastSong = array[array.length - 1];

    this.setState({
      peekQueueArr: array.slice(0, this.state.peekNo),
      backupArr: array.slice(this.state.peekNo),
      currentSong: array[0]
    });
  }

  /**
   * play a song
   * @param {Object} item the song to be played
   */
  onPlay(item) {
    // clear all the audios
    var audios = document.getElementsByTagName("audio");
    for (let i = 0, len = audios.length; i < len; i++) {
      audios[i].pause();
      audios[i].currentTime = 0;
      audios[i].remove();
    }

    let audio = document.createElement("audio");
    audio.src = item.url;
    audio.style.display = "none";
    audio.autoplay = false; //avoid the user has not interacted with your page issue
    document.body.appendChild(audio);

    // once audio end, play next
    audio.onended = () => {
      this.onPlay(this.getNextSong());
      this.shiftList();
    };

    this.handleAudioPlay(audio);
  }

  /**
   * get next a song
   * @return {Object} next song
   */
  getNextSong() {
    return this.state.peekQueueArr[0];
  }

  /**
   * when play or pause button is clicked
   */
  onPlayButtonClick() {
    let audio = document.getElementsByTagName("audio")[0];
    if (!audio) {
      // the first time playing
      this.onPlay(this.getNextSong());
      this.shiftList();
    } else {
      let currentStatus = this.state.isPlaying;
      if (currentStatus) {
        audio.pause();
        this.setState({
          isPlaying: false
        });
      } else {
        this.handleAudioPlay(audio);
      }
    }
  }

  /**
   * handle the promise of audio playing
   * @return {Element} audio that is to be played
   */
  handleAudioPlay(audio) {
    if (audio) {
      audio
        .play()
        .then(
          function () {
            this.setState({
              isPlaying: true
            });
          }.bind(this)
        )
        .catch(function () {
          message.warning("Oops, play fail. Please play next!");
        });
    }
  }

  /**
   * when replay or play-next button is clicked
   * @param {Boolean} toNext is to play next song or replay
   */
  onAngleButtonClick(toNext) {
    if (toNext) {
      this.onPlay(this.getNextSong());
      this.shiftList();
    } else {
      this.replay();
    }
  }

  /**
   * shuffle the order within the array given
   * @param {Array} newArr to be rearranged
   * @return {Array} newArr after shuffled
   */
  rearrangeSongs(newArr) {
    if (!newArr || newArr.length === 0) {
      return [];
    }
    var currentIndex = newArr.length,
      temporaryValue,
      randomIndex;
    const arrCopy = _.cloneDeep(newArr);

    // While there remain elements to shuffle
    while (0 !== currentIndex) {
      // Pick a remaining element
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = newArr[currentIndex];
      newArr[currentIndex] = newArr[randomIndex];
      newArr[randomIndex] = temporaryValue;
    }


    // if the first song is same as last song of the last loop, put it at the end to prevent consecutive same songs
    // skip if data length <=2, otherwise will make each loop the same
    if (_.isEqual(this.lastSong, newArr[0]) && this.dataLength > 2) {
      newArr.push(newArr.shift());
    }


    // make sure the new loop is different from last one
    if (_.isEqual(arrCopy, newArr)) {
      newArr.push(newArr.shift());
    }

    this.lastSong = newArr[newArr.length - 1];
    return _.cloneDeep(newArr);
  }

  /**
   * every time a song is played, update the peekQueue and backupArr by shifting both
   */
  shiftList() {
    const { backupArr, peekQueueArr } = this.state;
    // if not enough backup songs, generate a new loop to replenish
    let backupCopy = _.cloneDeep(backupArr);
    if (backupCopy.length <= 0) {
      backupCopy = this.rearrangeSongs(this.data);
    }

    const peekQueueCopy = _.cloneDeep(peekQueueArr);
    const currentSong = _.cloneDeep(peekQueueCopy[0]);

    // move the song from backup arr to the last of peekQueue
    peekQueueCopy.push(backupCopy[0]);
    peekQueueCopy.shift();
    backupCopy.shift();

    this.setState({
      peekQueueArr: peekQueueCopy,
      currentSong: currentSong,
      backupArr: backupCopy
    });
  }

  /**
   * replay current song
   */
  replay() {
    var audio = document.getElementsByTagName("audio")[0];
    if (audio) {
      audio.currentTime = 0;
      this.handleAudioPlay(audio);
    }
  }

  /**
   * toggle preview of current song
   */
  togglePreview() {
    this.setState(prevState => ({
      showPreview: !prevState.showPreview
    }));
  }

  /**
   * when slider change, reassign peekQueue and backupArr accordingly
   * @param {Integer} value the number of songs user set to view
   */
  onSliderChange(value) {
    const { peekQueueArr, backupArr } = this.state;

    let wholeList = peekQueueArr.concat(backupArr);
    const noOfLoop = _.ceil((value - wholeList.length) / this.dataLength); // number of loops needed to build new backupArr

    for (let i = 0; i < noOfLoop; i++) {
      wholeList = wholeList.concat(this.rearrangeSongs(this.data));
    }

    this.setState({
      peekNo: value,
      peekQueueArr: wholeList.slice(0, value),
      backupArr: wholeList.slice(value)
    });
  }

  render() {
    const {
      showPreview,
      isPlaying,
      currentSong,
      peekQueueArr,
      peekNo
    } = this.state;
    const isEmpty = this.dataLength === 0;
    return (
      <div className="player">
        <Popover
          content={"Slide to adjust length of your playlist!"}
          title=""
          trigger="hover"
          placement="topRight"
        >
          <div className="play-header">
            <header className="player-title">
              {!isEmpty && !showPreview && <h2>Up Next</h2>}
              {!isEmpty && showPreview && <h2>Now Playing</h2>}
              {isEmpty && <h2>Nothing in the List</h2>}
            </header>

            <Slider
              defaultValue={peekNo}
              min={this.peekMin}
              max={this.peekMax}
              disabled={this.peekMax <= 1 || isEmpty}
              onChange={value => this.onSliderChange(value)}
            />
          </div>
        </Popover>

        {!showPreview && (
          <PlayList data={peekQueueArr} onClick={null} className="play-list" />
        )}
        {showPreview && (
          <Preview
            className="album-preview"
            item={currentSong}
            onClick={this.togglePreview}
          />
        )}
        {!isEmpty && currentSong && (
          <PlayList
            data={[currentSong]}
            onClick={this.togglePreview}
            className="preview-small"
          />
        )}

        {!isEmpty && (
          <ActionButtons
            onPlayButtonClick={this.onPlayButtonClick}
            onAngleButtonClick={this.onAngleButtonClick}
            isPlaying={isPlaying}
          />
        )}
      </div>
    );
  }
}

export default App;
