import React from 'react';
import db from "../../components/db";
import {GameHead} from "../../components/helpers";
let host, post;

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


const unique = function(sorted) {
  sorted.sort();
  return sorted.filter(function(value, index, arr){
      if(index < 1) 
          return true;
      else
          return value !== arr[index-1];
  });
}

const drawingActivity = function() {
  var thisObj = document.querySelector(".character");
  var colorArray = [];	
  thisObj.querySelectorAll("path, rect").forEach(function(v){
    v.setAttribute("click", "no");
    v.setAttribute("once", "false");
    
  })
  thisObj.querySelectorAll("path, rect").forEach(function(v, i) {     
    if(v.getAttribute("fill") !== null) {
      if(v.getAttribute("fill") !== "none") {
        v.setAttribute("data-fill",v.getAttribute("fill"));
        colorArray.push(v.getAttribute("fill"));
        v.setAttribute("click", "yes");
        v.setAttribute("stroke", "#000000");
        v.setAttribute("stroke-width", "2");
        v.setAttribute("fill", "#fff");
      }
      else{
        v.setAttribute("fill", "none");
      }
    }
    else {
      v.setAttribute("fill", "none");
    }
  });
  colorArray = unique(colorArray);
  return colorArray;
}

const localData = function(data) {
  if(data) {
    localStorage.setItem("coloringactivity", JSON.stringify(data))
  }
  else {
    let data = {};
    if(localStorage.getItem("coloringactivity")) {
      data = JSON.parse(localStorage.getItem("coloringactivity"));
    }
    return data;
  }
}

const resetData = function() {
  var thisObj = document.querySelector(".character");
  thisObj.querySelectorAll("path, rect").forEach(function(v){
    v.setAttribute("click", "no")
  })
  thisObj.querySelectorAll("path, rect").forEach(function(v, i) {     
    if(v.getAttribute("fill") !== null) {
      if(v.getAttribute("fill") !== "none") {
        v.setAttribute("fill",v.getAttribute("data-fill"));
      }
    }
    else {
      v.setAttribute("fill", "none");
    }
  });
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colorArray:[]
    }
    this.setColor = this.setColor.bind(this);
    this.widthLoad = this.widthLoad.bind(this);
    this.playAgain = this.playAgain.bind(this);
    this.playItem = this.playItem.bind(this);
    

  }
  setColor(v) {
    this.setState({
      color:v
    })
  }
  componentDidMount() {
    let self = this;
    self.playItem();
    window.addEventListener('resize', self.widthLoad);
    self.widthLoad();    
    
  }

  playItem() {
    let self = this;
    self.setState({
      colorArray:drawingActivity()
    }, function(){
      let thisObj = document.querySelector(".character")
      thisObj.querySelectorAll("path[click='yes'], rect[click='yes']").forEach(function(v){
        v.addEventListener("click", function() {
          if(self.state.color) {
            v.setAttribute("fill", self.state.color);
            v.setAttribute("once", "true");
          }
          
          if(thisObj.querySelectorAll("[click='yes']").length === thisObj.querySelectorAll("[once='true']").length) {
            self.setState({
              score:true
            })
            document.querySelector("#btns button").click();
          }          
        });       
      })  
      if(document.querySelectorAll("#right-section span")[0]) {
        document.querySelectorAll("#right-section span")[0].click();      
      }
    })
  }

  playAgain() {
    var cloudMessage = document.querySelector(".cloud-message");
    cloudMessage.style.display = "none";
    resetData();
    this.playItem();

  }
 
  widthLoad() {
    if(document.querySelector("#character")) {
      let width = document.querySelector("#character").offsetWidth ;
      let height = document.querySelector("#character").offsetHeight;     
      if(width > height) {
        this.setState({
          width:(height/500)
        })
      }
      else {
        this.setState({
          width:(width/500)
        })
      }     
    }
  }
  checkScore(){
		var total = document.querySelectorAll("[click='yes']").length;
		var right = 0;
		document.querySelectorAll("[click='yes']").forEach(function(v, i) {		
			if(v.getAttribute("data-fill") === v.getAttribute("fill")) {
				right++;
			}    	
		});
	
    var cloudMessage = document.querySelector(".cloud-message");
    cloudMessage.style.display = "block";
    cloudMessage.querySelectorAll("strong")[0].innerText = parseInt((right/total)*100);
    //cloudMessage.querySelectorAll("strong")[1].innerText = total;		
  }
 
  render() {
    let self = this;
    let data = this.props.data;
    let size = 100/self.state.colorArray.length;
    let style = `
    .color-box span {
      height:${size}vh;
      border-radius:${size}vh 0 0 ${size}vh;
    }
    @media (orientation: portrait) { 
     .color-box span {
        width:${size}vw;
        height:50px;
        border-radius:${size}vw ${size}vw 0 0;
      }     
      .color-box span.active {
        width:${size}vw;
      }
    }
    `
    return <div id="main">
    <style>{style}</style>
    <section id="left-section">
        <div id="images">
        <a className="material-icons back" href="#">arrow_back</a>
        <img src={`/games/coloring-activity/${data.id}.png`} alt="" />
          </div>
          <div id="btns">
            <button onClick={this.checkScore}>Check Your Score</button>		
          </div>
      </section>
    <section id="character">
    <div className="character" dangerouslySetInnerHTML={{__html:self.props.data.data}} style={{transform: 'scale('+self.state.width+')'}} />
    </section>
      <section id="right-section" data-size={self.state.colorArray.length}>    
      <div className="color-box" data-type="dataType">
        {
          this.state.colorArray.map(function(v, i){
            let active = "";
            if(self.state.color === v) {
              active = "active";
            }
            return <span onClick={() => self.setColor(v)} style={{backgroundColor:v}} data-color={v} data-index={i} className={active}></span>
          })
        }
      </div>	
      </section>
      <div className="cloud-message" style={{display:'none'}}>
          <div className="cloud">
              <p>Your Scroe is <strong>5</strong> out of <strong>100</strong> </p>
              <p><button onClick={self.playAgain}>play again</button><a href="#">play others</a></p>
          </div>
      </div>
    </div>
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      data:props.data,
      localData:[],
      index:null,
      colorArray:[],
      color:null,
      score:false,
      activeData:null
    }
    this.playItem = this.playItem.bind(this);
    this.playOthers = this.playOthers.bind(this);
    this.hashChange = this.hashChange.bind(this);
    
    
    // host = document.body.getAttribute("data-host");
    // post = document.body.getAttribute("data-post");
  }
  
  componentDidMount() {
    let self = this;
    self.setState({
        
      localData:localData()
     })

     let hash = window.location.hash.replace("#", "");
     self.hashChange(hash);
     window.addEventListener("hashchange", function(){
       let hash = window.location.hash.replace("#", "");
       self.hashChange(hash);
     }, false); 
    
  }
  

  
  playItem(index) {
    this.setState({
      index
    })
  }
  playOthers() {
    let self = this;
    this.setState({
      activeData:null,
      id:""
    })
  }

  hashChange(id) {
    let self = this;
    let data = self.state.data;
    let activeData = null;
    if(data.length) {
      data.forEach(function(v, i){
        if(v.data.id === id) {
          activeData = v.data;
        }
      })     
    }
    self.setState({
      activeData,
      id
    })
  }
  
  
  render() {
    let self = this;
    const {page} = self.props;
    let html =  <div className="scrolling-area">
    <div className="items-list coloring-activities">
    <h1><a href="https://tinykidszone.com/"><img src="https://tinykidszone.com/images/tkz-logo.png" alt="Tiny Kids Zone" /></a></h1>
    <p>Coloring Activities, Games and Exercises which helpful to learn colors and arts to all kids.</p>
    <ul>
      {
        self.state.data.map(function(val, i){
            const v = val.data;
          let item = "";
          if(self.state.localData[i] === null) {

          }
          else {
            let missed = self.state.localData[i];
            if(missed > 90) {
              item = "favorite";
            }
            else if(missed > 70 && missed <= 90) {
              item = "star";
            }
            else if(missed > 50 && missed <= 70) {
              item = "thumb_up";
            }
            else {
              item = "thumb_down";
            }  
          }
         
          let style = {
            backgroundImage:`url(/games/coloring-activity/${v.id}.png)`
          }
          return <li key={v.id}>
            <a href={`/coloring-activities#${v.id}`}>
              <i className={"material-icons"}>{item}</i>
              <img src={`/images/image-1x1.png`} style={style} alt={v.title} />
              <span>{v.title}</span>
            </a>
          </li>
        })
      }
    </ul>
  </div>
  </div>
    
    if(self.state.activeData) {
       html =    <Game data={self.state.activeData} key={self.state.id} index={self.state.id} playAgain={self.playItem} playOthers={self.playOthers} />

    }

    return <div id="root">
         <GameHead data={page} />
        {html}
    </div>
    
  }
}


export async function getStaticProps() {
  const page = await db.getGames("coloring-activities");
  const data = await db.getColoringActivities();
  return {
    props: {
      page:page[0].data,
      data
    }
  }
}
export default App;
