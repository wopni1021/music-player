import React, { Component } from "react";
import "antd/lib/icon/style/css";
import Preview from "./Preview";
import PlayList from "./PlayList";
import ActionButtons from "./ActionButtons";
import "./App.css";

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
      {
        title: "Anchor",
        singer: "Motorama",
        image: "/assets/images/cover4.jpg",
        url:
          "https://dl.last.fm/static/1543141124/114320956/9b9f7c0ebbb66e2e2abe0bea3d09a66c7f4c6c44d6cac1c8d0c612f24d191272/Motorama+-+Anchor.mp3"
      },
      {
        title: "Lovesick Teenagers",
        singer: "Bear in Heaven ",
        image: "/assets/images/cover5.jpg",
        url:
          "https://dl.last.fm/static/1543141173/119595371/80f717d17d5725436779ed938188f5a9e9a64ffcc95e7f1e42412e2603d0a475/Bear+in+Heaven+-+Lovesick+Teenagers.mp3"
      },
      {
        title: "I Will Drown",
        singer: "Soley",
        image: "/assets/images/cover6.jpg",
        url:
          "https://dl.last.fm/static/1543141307/127464931/f706d78a2197bf7082d02cde7e05530345a14cf4613bbb7a3e5958268e5dc054/S%C3%B3ley+-+I%27ll+Drown.mp3"
      },
      {
        title: "My Leather, My Fur, My Nails",
        singer: "Stepdad Ordinaire",
        image: "/assets/images/cover7.jpg",
        url:
          "https://dl.last.fm/static/1543141307/122034527/0f5aea3e97a0987dc8ae02c8f80218631db1f2da0d3bc927a6a0f96f7128199b/Stepdad+-+My+Leather%2C+My+Fur%2C+My+Nails.mp3"
      },
      {
        title: "Deeper Than Inside",
        singer: "Sammy",
        image: "/assets/images/cover8.jpg",
        url:
          "https://dl.last.fm/static/1543141307/117125661/a5ca70d0443f17ad64d49cb34ebf17eb8dc1d7ad117b5d8ea9cb64665bd464a5/Rites+of+Spring+-+Deeper+Than+Inside.mp3"
      },
      {
        title: "Cute Thing",
        singer: "Iris Lee",
        image: "/assets/images/cover9.jpg",
        url:
          "https://dl.last.fm/static/1543141536/129398378/3c52c8872bd4b7fb5ea74aaecdcffab3b19c5474f65ccf9cc500f89a56207e91/Car+Seat+Headrest+-+Cute+Thing.mp3"
      }
    ];
    this.state = {
      showPreview: false,
      isPlaying: false,
      isShuffle: true,
      currentSong: null,
      shuffledData: this.data
    };

    this.onPlayButtonClick = this.onPlayButtonClick.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onAudioEnd = this.onAudioEnd.bind(this);
    this.onAngelButtonClick = this.onAngelButtonClick.bind(this);
    // this.onModeButtonClick = this.onModeButtonClick.bind(this);
    this.togglePreview = this.togglePreview.bind(this);
  }

  componentDidMount() {}

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
    audio.style.display = "none"; //added to fix ios issue
    audio.autoplay = false; //avoid the user has not interacted with your page issue
    document.body.appendChild(audio);
    audio.onended = () => this.onAudioEnd(audio, item);
    audio.play();
  }

  onAudioEnd(audio, item) {
    audio.remove(); //remove after playing to clean the Dom

    var nextSong = this.getNextSong(item);

    if (this.state.currentSong && this.state.isPlaying) {
      this.setState({
        currentSong: nextSong
      });
      this.onPlay(nextSong);
    }
  }

  onPlayButtonClick() {
    let audio = document.getElementsByTagName("audio")[0];
    if (!audio) {
      // if no current song, shuffle the list and play
      // const shuffled = this.setSongs();
      // this.setState({
      //   shuffledData: shuffled
      // });
      this.onPlay(this.state.shuffledData[0]);
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
      console.log("going to play next song");
      nextToPlay = this.getNextSong(this.state.currentSong);
    } else {
      nextToPlay = this.getPreviousSong(this.state.currentSong);
    }
    this.onPlay(nextToPlay);
  }

  // onModeButtonClick(toShuffle) {
  //   console.log("toshuffle=" + toShuffle + ".....");
  //   this.setState({
  //     shuffledData: toShuffle ? this.getShuffledSongs() : this.data,
  //     isShuffle: toShuffle
  //   });
  // }

  setSongs() {
    if (this.state.isShuffle) {
      return this.getShuffledSongs();
    } else {
      return this.data.slice(0);
    }
  }

  getShuffledSongs() {
    const array = this.data.slice(0);
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  getNextSong(item) {
    for (var i = 0; i < this.state.shuffledData.length - 1; i++) {
      if (item === this.state.shuffledData[i]) {
        return this.state.shuffledData[i + 1];
      }
    }
    this.setState({
      shuffledData: this.setSongs()
    });
    return this.state.shuffledData[0];
  }

  getPreviousSong(item) {
    for (var i = 1; i < this.state.shuffledData.length; i++) {
      if (item === this.state.shuffledData[i]) {
        return this.state.shuffledData[i - 1];
      }
    }
    return this.state.shuffledData[this.state.shuffledData.length - 1];
  }

  togglePreview() {
    this.setState(prevState => ({
      showPreview: !prevState.showPreview
    }));
  }

  render() {
    const {
      showPreview,
      isPlaying,
      isShuffle,
      currentSong,
      shuffledData
    } = this.state;
    return (
      <div className="player">
        <header className="player-header">
          <b>Up Next</b>
        </header>

        {!showPreview && (
          <PlayList
            data={shuffledData}
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

        {/* {currentSong && (
          <List
            itemLayout="horizontal"
            dataSource={[currentSong]}
            className="preview-small"
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={process.env.PUBLIC_URL + item.image} />}
                  title={item.title}
                  description={item.singer}
                  onClick={() =>
                    this.setState({
                      showPreview: !showPreview
                    })
                  }
                />
              </List.Item>
            )}
          />
        )} */}

        <ActionButtons
          onPlayButtonClick={this.onPlayButtonClick}
          onAngelButtonClick={this.onAngelButtonClick}
          // onModeButtonClick={this.onModeButtonClick}
          isPlaying={isPlaying}
          isShuffle={isShuffle}
        />
      </div>
    );
  }
}

export default App;
