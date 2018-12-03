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

    // if only 1 song, duplicate the song in data for loop purpose
    this.data = data.length === 1 ? data.concat(data) : data;

    this.peekMax = this.data.length > 1 ? Math.min(this.data.length - 1, 8) : 1; // the max number user can choose to view in the page
    this.peekMin = 1; // the min number user can choose to view in the page

    this.state = {
      showPreview: false,
      isPlaying: false,
      currentSong: null,
      peekNo: Math.min(this.peekMax, 5), //number of songs user want to see in the list, default = 5
      counter: 0, //number of songs played already

      // peekQueueArr + backupArry = whole data list/loop;
      // every time a song is played, peekQueue will move that song to the backupArr, so that each loop will contain the whole data
      peekQueueArr: [], //songs to be played, displayed in the playlist
      backupArr: [] // songs not displayed but will replenish peekQueue
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
    }, () => {
      console.log('after' + this.state.peekNo)
  });
    console.log('testsss')
    console.log(this.peekMax);
    console.log(this.state.peekNo)
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
    audio.onended = () => {
      // play the next song
      this.onPlay(this.state.peekQueueArr[0]);
      this.shiftList();
    };
    audio.play().catch(() => {
      console.log("error");
    });
  }

  onPlayButtonClick() {
    let audio = document.getElementsByTagName("audio")[0];
    if (!audio) {
      console.log("first=" + this.state.peekQueueArr[0].url);
      const nowPlay = this.state.peekQueueArr[0];
      this.onPlay(nowPlay);
      this.shiftList();
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
    if (toNext) {
      this.onPlay(this.state.peekQueueArr[0]);
      this.shiftList();
    } else {
      this.replay();
    }
  }

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

  // shift the whole array, so that peekqueue is updated with next-to-play songs
  // AND move the already-played song (previously in the peekqueue) to the backup array
  shiftList() {
    const { counter, backupArr, peekQueueArr } = this.state;
    const newCounter = counter + 1; //counter including next song
    let backupCopy = _.cloneDeep(backupArr);
    const peekQueueCopy = _.cloneDeep(peekQueueArr);
    const currentSong = _.cloneDeep(peekQueueCopy[0]);

    // decide whether need to rearrange the order of the next few songs; if peekNo = 2, then when 12345 -> 45XXX need to shuffle
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

  setCurrentSong(currentSong) {
    this.setState({
      currentSong: currentSong
    });
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
              {!showPreview && <h2>Up Next</h2>}
              {showPreview && <h2>Now Playing</h2>}
            </header>

            {this.peekMax > 1 && <Slider
              defaultValue={peekNo}
              min={this.peekMin}
              max={this.peekMax}
              onChange={value => this.onSliderChange(value)}
            />}
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
