import React from 'react';
import db from "../../components/db";
import {GameHead} from "../../components/helpers";


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
  constructor(props) {
    super(props);
    this.state = {     
      page:props.page,
      data:props.data
    }
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
    let {page} = self.state;
    return <div id="root">
        <div className="animals-sounds">
         <GameHead data={page} />
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

export async function getStaticProps() {
  const page = await db.getGames("animal-sounds");
  const data = await db.getAnimalsSounds();
  return {
    props: {
      page:page[0].data,
      data
    }
  }
}

export default App;


