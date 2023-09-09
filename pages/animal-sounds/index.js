import Head from "next/head";
import db from "../../components/db";
import React from 'react';

let post;

const getAppData = function(key, data) {
  let appData = {};
  if(localStorage.getItem("appData")) {
    appData = JSON.parse(localStorage.getItem("appData"));
  }
  key = window.btoa(JSON.stringify(key));
  if(data) {
    appData[key] = data;
    localStorage.setItem("appData", JSON.stringify(appData));
  }
  else {
    if(appData[key]) {
      return appData[key];
    }
    else {
      return null;
    }
  }
}

const fetchData = function(data, callback) {
  let haveData = getAppData(data);
  if(haveData) {
    callback(haveData);
  }
  fetch(post + "games.php", {
    method: 'POST', // or 'PUT'
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(responseData => {
    getAppData(data, responseData);
    if(!haveData) {
      callback(responseData);  
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {     
      data:[]
    }
    //post = document.body.getAttribute("data-post");
  }
  
  componentWillMount() {
    let self = this;
    // fetchData({
    //   method:"getGames",
    //   type:"animalssounds"
    // }, function(data){
    //   self.setState({
    //     data
    //   })
    // })
    db.getAnimalsSounds().then(function(data){
            self.setState({
        data
      })
    })
  }

  playAudio(event){
    var thisApp = event.currentTarget;
    var playIcon = thisApp.querySelector(".material-icons")
    var s = new Audio(thisApp.getAttribute("data-audio"));
    s.loop = 0;
    s.play();
    s.onended  = function() {	
      playIcon.innerText  = "play_circle_outline";
    }
    s.onplay  = function() {
      playIcon.innerText  = "pause_circle_outline";
    }
  }
  
  

  
  
  render() {
    let self = this;
    return <div id="root">
        <div className="animals-sounds">
         <Head>
            <title>Ravi</title>
            <link href="/css/game.css" rel="stylesheet"/>
            <link href="/css/animal-sounds.css" rel="stylesheet"/>
        </Head>
    <header>
    <h1><a href="https://tinykidszone.com/"><img src="https://tinykidszone.com/images/tkz-logo.png" alt="Tiny Kids Zone" /></a></h1>
    <h2>Animal Sounds and Activities</h2>
    </header>
    <div class="list">
    <ul>
      {
        self.state.data.map(function(val){
            const v = val.data;
            console.log(v);
          return <li data-audio={`/games/animals-sounds/${v.id}.mp3`} onClick={self.playAudio}><img src={`/games/animals-sounds/${v.id}.png`} alt={v.name} /><h3>{v.text}</h3><span>{v.name}</span><i className="material-icons" data-dir="pause_circle_outline">play_circle_outline</i></li>
        })
      }
	  </ul>
    </div>
    </div>
    </div>
  }
}

export default App;
