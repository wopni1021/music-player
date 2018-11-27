import React, { Component } from "react";
import _ from "lodash";
import "antd/lib/icon/style/css";
import Preview from "./Preview";
import PlayList from "./PlayList";
import ActionButtons from "./ActionButtons";
import "./App.css";
import "antd/lib/slider/style/css";
import { Slider } from "antd";

class App extends Component {
  constructor(props) {
    super(props);

    this.data = [
      // {
      //   title: "One Day You Will Teach Me to Let Go of My Fears",
      //   singer: "Sleepmakeswaves",
      //   image: '/assets/images/cover0.jpg',
      //   // url:
      //   //   "https://dl.last.fm/static/1543036799/110637448/fdcfdfc9339d2673e83219378e4f5fd612e36453127ea4e9f4a2c15e8b6f3a3e/Sleepmakeswaves+-+One+Day+You+Will+Teach+Me+to+Let+Go+of+My+Fears.mp3"
      //   url: "http://www.noiseaddicts.com/samples_1w72b820/3719.mp3"
      // },
      // {
      //   title: "Now We Can See",
      //   singer: "The Thermals",
      //   image: '/assets/images/cover1.jpg',
      //   // url:
      //   //   "https://dl.last.fm/static/1543036974/119687700/add481d515c066a42af8a2293f8e43eac1ff5c5977b894112902ea69c3c7287a/The+Thermals+-+Now+We+Can+See.mp3"
      //   url: "http://www.noiseaddicts.com/samples_1w72b820/3723.mp3"
      // },
      // {
      //   title: "Not Like This",
      //   singer: "Iron Chic",
      //   image: '/assets/images/cover2.jpg',
      //   // url:
      //   //   "https://dl.last.fm/static/1543037065/123117734/b9254e25a31efe80c8b2c5e8fdcb6eeca232b69472bbf422b48bc8ae5adb452d/Iron+Chic+-+Cutesy+Monster+Man.mp3"

      //   url: "http://www.noiseaddicts.com/samples_1w72b820/3725.mp3"
      // },
      // {
      //   title: "Paradise",
      //   singer: "Douglas Dare",
      //   image: '/assets/images/cover3.jpg',
      //   url: "https://dl.last.fm/static/1543141043/132562470/016d68a860182ba59413199a1f68d800fed1a9743731338499cc5318d28dccfb/Calexico+-+Para.mp3"
      // },
      // {
      //   title: "Anchor",
      //   singer: "Motorama",
      //   image: "/assets/images/cover4.jpg",
      //   url:
      //     "https://dl.last.fm/static/1543141124/114320956/9b9f7c0ebbb66e2e2abe0bea3d09a66c7f4c6c44d6cac1c8d0c612f24d191272/Motorama+-+Anchor.mp3"
      // },
      // {
      //   title: "Lovesick Teenagers",
      //   singer: "Bear in Heaven ",
      //   image: "/assets/images/cover5.jpg",
      //   url:
      //     "https://dl.last.fm/static/1543141173/119595371/80f717d17d5725436779ed938188f5a9e9a64ffcc95e7f1e42412e2603d0a475/Bear+in+Heaven+-+Lovesick+Teenagers.mp3"
      // },
      // {
      //   title: "I Will Drown",
      //   singer: "Soley",
      //   image: "/assets/images/cover6.jpg",
      //   url:
      //     "https://dl.last.fm/static/1543141307/127464931/f706d78a2197bf7082d02cde7e05530345a14cf4613bbb7a3e5958268e5dc054/S%C3%B3ley+-+I%27ll+Drown.mp3"
      // },
      // {
      //   title: "My Leather, My Fur, My Nails",
      //   singer: "Stepdad Ordinaire",
      //   image: "/assets/images/cover7.jpg",
      //   url:
      //     "https://dl.last.fm/static/1543141307/122034527/0f5aea3e97a0987dc8ae02c8f80218631db1f2da0d3bc927a6a0f96f7128199b/Stepdad+-+My+Leather%2C+My+Fur%2C+My+Nails.mp3"
      // },
      // {
      //   title: "Deeper Than Inside",
      //   singer: "Sammy",
      //   image: "/assets/images/cover8.jpg",
      //   url:
      //     "https://dl.last.fm/static/1543141307/117125661/a5ca70d0443f17ad64d49cb34ebf17eb8dc1d7ad117b5d8ea9cb64665bd464a5/Rites+of+Spring+-+Deeper+Than+Inside.mp3"
      // },
      // {
      //   title: "Cute Thing",
      //   singer: "Iris Lee",
      //   image: "/assets/images/cover9.jpg",
      //   url:
      //     "https://dl.last.fm/static/1543141536/129398378/3c52c8872bd4b7fb5ea74aaecdcffab3b19c5474f65ccf9cc500f89a56207e91/Car+Seat+Headrest+-+Cute+Thing.mp3"
      // }
      {
        title: "0",
        singer: "Motorama",
        image: "/assets/images/cover4.jpg",
        url: "http://www.noiseaddicts.com/samples_1w72b820/3719.mp3"
      },
      {
        title: "1",
        singer: "Bear in Heaven ",
        image: "/assets/images/cover5.jpg",
        // url:
        //   "https://dl.last.fm/static/1543141173/119595371/80f717d17d5725436779ed938188f5a9e9a64ffcc95e7f1e42412e2603d0a475/Bear+in+Heaven+-+Lovesick+Teenagers.mp3"
        url: "http://www.noiseaddicts.com/samples_1w72b820/3719.mp3"
      },
      {
        title: "2",
        singer: "Soley",
        image: "/assets/images/cover6.jpg",
        // url:
        //   "https://dl.last.fm/static/1543141307/127464931/f706d78a2197bf7082d02cde7e05530345a14cf4613bbb7a3e5958268e5dc054/S%C3%B3ley+-+I%27ll+Drown.mp3"
        url: "http://www.noiseaddicts.com/samples_1w72b820/3719.mp3"
      },
      {
        title: "3",
        singer: "Stepdad Ordinaire",
        image: "/assets/images/cover7.jpg",
        url: "http://www.noiseaddicts.com/samples_1w72b820/3719.mp3"
      },
      {
        title: "4",
        singer: "Sammy",
        image: "/assets/images/cover8.jpg",
        url: "http://www.noiseaddicts.com/samples_1w72b820/3719.mp3"
      },
      {
        title: "5",
        singer: "Iris Lee",
        image: "/assets/images/cover9.jpg",
        url:
          "https://dl.last.fm/static/1543141536/129398378/3c52c8872bd4b7fb5ea74aaecdcffab3b19c5474f65ccf9cc500f89a56207e91/Car+Seat+Headrest+-+Cute+Thing.mp3"
      },
      {
        title: "6",
        singer: "Sleepmakeswaves",
        image: "/assets/images/cover0.jpg",
        // url:
        //   "https://dl.last.fm/static/1543036799/110637448/fdcfdfc9339d2673e83219378e4f5fd612e36453127ea4e9f4a2c15e8b6f3a3e/Sleepmakeswaves+-+One+Day+You+Will+Teach+Me+to+Let+Go+of+My+Fears.mp3"
        url: "http://www.noiseaddicts.com/samples_1w72b820/3719.mp3"
      },
      {
        title: "7",
        singer: "The Thermals",
        image: "/assets/images/cover1.jpg",
        // url:
        //   "https://dl.last.fm/static/1543036974/119687700/add481d515c066a42af8a2293f8e43eac1ff5c5977b894112902ea69c3c7287a/The+Thermals+-+Now+We+Can+See.mp3"
        url: "http://www.noiseaddicts.com/samples_1w72b820/3723.mp3"
      }
    ];
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
    this.onAngelButtonClick = this.onAngelButtonClick.bind(this);
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
      // if no current song, shuffle the list and play
      // const shuffled = this.setSongs();
      // this.setState({
      //   shuffledData: shuffled
      // });
      // this.setState({
      //   shuffledData: this.state.currentLoop.slice(
      //     this.state.firstIndex,
      //     this.state.firstIndex + this.state.peekNo
      //   )
      // });
      //!!! first shuffle to randomize

      this.onPlay(this.state.peekQueueArr[0]);
    } else {
      let currentStatus = this.state.isPlaying;
      if (currentStatus) {
        audio.pause();
        console.log("paused");
      } else {
        audio.play();
      }
      this.setState(
        {
          isPlaying: !currentStatus
        },
        () => console.log("setplay to false!!!" + this.state.isPlaying)
      );
    }
  }

  onAngelButtonClick(toNext) {
    let nextToPlay;
    if (toNext) {
      nextToPlay = this.getNextSong();
    } else {
      nextToPlay = this.getPreviousSong(this.state.currentSong);
    }
    this.onPlay(nextToPlay);
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
    const newCounter = this.state.counter + 1; //counter including next song
    let bk = _.cloneDeep(this.state.backupArr);
    let queue = _.cloneDeep(this.state.peekQueueArr);
    const currentPlaying = _.cloneDeep(queue[0]);
    queue.push(_.cloneDeep(bk[0]));
    bk.push(_.cloneDeep(queue[0]));
    bk.shift();
    queue.shift();

    const needToShuffleBkArr =
      this.state.counter % (this.data.length - this.state.peekNo) ===
      this.data.length - this.state.peekNo - 1;
    if (needToShuffleBkArr) {
      bk = this.getShuffledSongs(_.cloneDeep(bk));
    }
    this.setState({
      counter: newCounter,
      peekQueueArr: queue,
      currentSong: currentPlaying,
      backupArr: bk
    });
    return queue;
  }

  getPreviousSong(item) {
    //   for (let i = 1; i < this.state.shuffledData.length; i++) {
    //     if (item === this.state.shuffledData[i]) {
    //       return this.state.shuffledData[i - 1];
    //     }
    //   }
    //   return this.state.shuffledData[this.state.shuffledData.length - 1];
  }

  togglePreview() {
    this.setState(prevState => ({
      showPreview: !prevState.showPreview
    }));
  }

  onSliderChange(value) {
    const wholeList = this.state.peekQueueArr.concat(this.state.backupArr);
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
        <div className="play-header">
          <header className="player-title">
            <b>Up Next</b>
          </header>
          <Slider
            defaultValue={5}
            min={1}
            max={8}
            onChange={value => this.onSliderChange(value)}
          />
        </div>

        {!showPreview && (
          <PlayList
            data={peekQueueArr}
            onClick={this.onPlay}
            className="play-list"
          />
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
          onAngelButtonClick={this.onAngelButtonClick}
          isPlaying={isPlaying}
        />
      </div>
    );
  }
}

export default App;
