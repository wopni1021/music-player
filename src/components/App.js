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

    this.data = data.length === 1 ? data.concat(data) : data; // if only 1 song, duplicate the song in array for loop purpose

    this.peekMax = this.data.length > 3 ? Math.min(this.data.length - 3, 8) : 1; // the max number user can choose to view in the page; at most 8
    this.peekMin = Math.min(this.data.length, 1); // the min number user can choose to view in the page

    this.state = {
      showPreview: false,
      isPlaying: false,
      currentSong: null,
      peekNo: this.peekMax,
      counter: 0, //number of songs played already

      /* peekQueueArr + backupArry = whole data list/loop; */
      peekQueueArr: [], //songs to be played, displayed in the playlist, the first song is the next one to play
      backupArr: [] // songs not displayed but will replenish peekQueue
    };

    this.onPlayButtonClick = this.onPlayButtonClick.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onAngleButtonClick = this.onAngleButtonClick.bind(this);
    this.togglePreview = this.togglePreview.bind(this);
    this.shiftList = this.shiftList.bind(this);
    this.handleAudioPlay = this.handleAudioPlay.bind(this);
  }

  componentDidMount() {
    this.setState(
      {
        peekQueueArr: _.cloneDeep(this.data.slice(0, this.state.peekNo)),
        backupArr: _.cloneDeep(this.data.slice(this.state.peekNo)),
        currentSong: this.data[0]
      },
      () => {
        console.log("after" + this.state.peekNo);
      }
    );
  }

  /* play a song
     @param {Object} item  the song to play */
  onPlay(item) {
    // clear all the audios
    var audios = document.getElementsByTagName("audio");
    for (var i = 0, len = audios.length; i < len; i++) {
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
      this.onPlay(this.state.peekQueueArr[0]);
      this.shiftList();
    };

    this.handleAudioPlay(audio);
  }

  onPlayButtonClick() {
    let audio = document.getElementsByTagName("audio")[0];
    if (!audio) {
      // the first time playing
      console.log("first=" + this.state.peekQueueArr[0].url);
      const nowPlay = this.state.peekQueueArr[0];
      this.onPlay(nowPlay);
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

  handleAudioPlay(audio) {
    if (audio) {
      audio
        .play()
        .then(
          function() {
            this.setState({
              isPlaying: true
            });
          }.bind(this)
        )
        .catch(function() {
          console.log("error!");
          message.warning("Oops, play fail. Please play next.");
        });
    }
  }

  // param {Boolean} is to play next or replay
  onAngleButtonClick(toNext) {
    if (toNext) {
      this.onPlay(this.state.peekQueueArr[0]);
      this.shiftList();
    } else {
      this.replay();
    }
  }

  // param {Array} shuffle the order of the array given
  rearrangeSongs(newArr) {
    var currentIndex = newArr.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = newArr[currentIndex];
      newArr[currentIndex] = newArr[randomIndex];
      newArr[randomIndex] = temporaryValue;
    }
    return newArr;
  }

  /* Every time a song is played, peekQueue will move that song to the backupArr, and backupArr will move a song to peekQueue;
  so that each loop (peekQueue + backupArr) will contain the whole data list.
     When peekQueue reach the end of current loop, the backupArr will shuffle, and replenish peekQueue;
  so that each loop will be different, and each peekQueue will have non-repeated songs */
  shiftList() {
    const { counter, backupArr, peekQueueArr } = this.state;
    const newCounter = counter + 1; //counter including next song
    let backupCopy = _.cloneDeep(backupArr);
    const peekQueueCopy = _.cloneDeep(peekQueueArr);
    const currentSong = _.cloneDeep(peekQueueCopy[0]);

    // decide whether need to rearrange the order of the backupArr;
    // e.g. if peekNo = 2 and current loop = [1,2,3,4,5], then when peekQueue reach [4, 5], backupArr need to shuffle
    const shouldRearrangeBkArr =
      this.state.counter % this.data.length ===
      this.data.length - this.state.peekNo + 1;
    // console.log("should rearrange: " + shouldRearrangeBkArr);
    if (shouldRearrangeBkArr) {
      backupCopy = this.rearrangeSongs(backupCopy);
    }

    // move the song from backup arr to the last of queue array
    peekQueueCopy.push(backupCopy[0]);
    backupCopy.push(peekQueueCopy[0]);
    backupCopy.shift();
    peekQueueCopy.shift();

    // console.log("peek");
    // for (let i = 0; i < peekQueueCopy.length; i++)
    //   console.log(i + 1 + ": " + peekQueueCopy[i].url);

    // console.log("backup");
    // for (let i = 0; i < backupCopy.length; i++)
    //   console.log(i + 1 + ": " + backupCopy[i].url);

    this.setState({
      counter: newCounter,
      peekQueueArr: peekQueueCopy,
      currentSong: currentSong,
      backupArr: backupCopy
    });
  }

  replay() {
    var audio = document.getElementsByTagName("audio")[0];
    if (audio) {
      audio.currentTime = 0;
      this.handleAudioPlay(audio);
    }
  }

  togglePreview() {
    this.setState(prevState => ({
      showPreview: !prevState.showPreview
    }));
  }

  // when slider change, reassign peekQueue and backupArr accordingly
  onSliderChange(value) {
    const { peekQueueArr } = this.state;
    const wholeList = peekQueueArr.concat(this.state.backupArr);
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
    const isEmpty = this.data.length === 0;
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
              disabled={this.peekMax <= 1}
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
