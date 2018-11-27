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

import { Slider, Popover } from "antd";

class App extends Component {
  constructor(props) {
    super(props);

    this.data = data;
    this.state = {
      showPreview: false,
      isPlaying: false,
      currentSong: null,
      peekNo: 5, //number of songs user want to see in the list, default = 5
      counter: 0, //number of songs played already
      peekQueueArr: [], //songs to be displayed
      backupArr: [] // songs not displayed but can be chosen as next songs (non-repeat compared with peekQueue)
    };

    this.onPlayButtonClick = this.onPlayButtonClick.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onAngleButtonClick = this.onAngleButtonClick.bind(this);
    this.togglePreview = this.togglePreview.bind(this);
    this.shiftList = this.shiftList.bind(this);
  }

  componentDidMount() {
    this.setState({
      peekQueueArr: _.cloneDeep(this.data.slice(0, this.state.peekNo)),
      backupArr: _.cloneDeep(this.data.slice(this.state.peekNo)),
      currentSong: this.data[0]
    });
  }

  // pass next song and play it
  onPlay(item) {
    this.setState({
      currentSong: item,
      isPlaying: true
    });
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
    audio.onended = () => this.onPlay(this.state.peekQueueArr[0]);
    audio.play();
    this.shiftList();
  }

  onPlayButtonClick() {
    let audio = document.getElementsByTagName("audio")[0];
    if (!audio) {
      this.onPlay(this.state.peekQueueArr[0]);
    } else {
      let currentStatus = this.state.isPlaying;
      if (currentStatus) {
        audio.pause();
      } else {
        audio.play();
      }
      this.setState({
        isPlaying: !currentStatus
      });
    }
  }

  onAngleButtonClick(toNext) {
    let nextToPlay;
    if (toNext) {
      nextToPlay = this.getNextSong();
      this.onPlay(nextToPlay);
    } else {
      this.replay();
    }
  }

  getShuffledSongs(newArr) {
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

  getNextSong() {
    return this.shiftList()[0];
  }

  shiftList() {
    const { counter, backupArr, peekQueueArr } = this.state;
    const newCounter = counter + 1; //counter including next song
    let bk = _.cloneDeep(backupArr);
    const queue = _.cloneDeep(peekQueueArr);
    const currentPlaying = _.cloneDeep(queue[0]);
    // move the song from backup arr to the last of queue array
    queue.push(bk[0]);
    bk.push(queue[0]);
    bk.shift();
    queue.shift();

    // decide whether need to shuffle the next few songs; if peekNo = 2, then when 12345 -> 45XXX need to shuffle
    const needToShuffleBkArr =
      this.state.counter % (this.data.length - this.state.peekNo) ===
      this.data.length - this.state.peekNo - 1;
    if (needToShuffleBkArr) {
      bk = this.getShuffledSongs(bk);
    }
    this.setState({
      counter: newCounter,
      peekQueueArr: queue,
      currentSong: currentPlaying,
      backupArr: bk
    });
    return queue; //peekQueue
  }

  replay() {
    var audio = document.getElementsByTagName("audio")[0];
    if (audio) {
      audio.currentTime = 0;
      audio.play();
      this.setState({
        isPlaying: true
      });
    }
  }

  togglePreview() {
    this.setState(prevState => ({
      showPreview: !prevState.showPreview
    }));
  }

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
    const { showPreview, isPlaying, currentSong, peekQueueArr } = this.state;
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
              <h2>Up Next</h2>
            </header>

            <Slider
              defaultValue={5}
              min={1}
              max={8} //smaller than data size and consider resolution
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

        {currentSong && (
          <PlayList
            data={[currentSong]}
            onClick={this.togglePreview}
            className="preview-small"
          />
        )}

        <ActionButtons
          onPlayButtonClick={this.onPlayButtonClick}
          onAngleButtonClick={this.onAngleButtonClick}
          isPlaying={isPlaying}
        />
      </div>
    );
  }
}

export default App;
