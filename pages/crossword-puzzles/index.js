import React from 'react';
import db from "../../components/db";
import {GameHead} from "../../components/helpers";


let host = "", post = "";

const alphabetString = "abcdefghijklmnopqrstuvwxyz0123456789";

const shuffle = function(data) {
  let randomArray = [];  
  data.forEach(function(v, i){
    randomArray.push(i);
  })
  randomArray.sort( () => .5 - Math.random() );

  return randomArray.map(function(v){
    return data[v];
  })
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      image:props.data.image,
      color:props.data.color,
      data:JSON.parse(props.data.data)
    }
    this.resizeArea = this.resizeArea.bind(this);
    this.action = this.action.bind(this);
    this.playAgain= this.playAgain.bind(this);
  }
  resizeArea() {
    let alphabetArea = document.querySelector("#alphabet-area");
    let width = document.body.offsetWidth;
    let height = document.body.offsetHeight; 
    let data = this.state.data;
    let w = data.width;
    let h = data.height;
    let scale = 1;
    if(width > height) {
      scale = height/h;
    }
    else {
      scale = width/w;
    }
    alphabetArea.style.transform = `translate(-50%, -50%) scale(${scale})`; 
    
    //alphabetArea.
  }
  checkFill() {
    let alphabetArea = document.querySelector("#alphabet-area");
    if(alphabetArea.querySelectorAll(".done").length) {
      document.querySelector(".action .reset").classList.remove("none");
      //document.querySelector(".action .submit").classList.remove("none");
    }
    if(alphabetArea.querySelectorAll(".done").length === alphabetArea.querySelectorAll(".no").length) {
      document.querySelector(".action .submit").classList.remove("none");
    }
  }
  componentDidMount() {
    let self = this;
    self.resizeArea();
    window.addEventListener('resize', function(){
      self.resizeArea();
    });
  }
  alphabetClick(event) {
    let alphabetKeyboard = document.querySelector("#alphabet-keyboard");
    let alphabetArea = document.querySelector("#alphabet-area");
    
    if(event) {
      if(alphabetString.indexOf(event) === -1) {
        if(event.currentTarget.classList.contains("yes")) {
          return false;
        }
        if(event.currentTarget.classList.contains("wrong")) {
          return false;
        }
        if(event.currentTarget.classList.contains("right")) {
          return false;
        }
        
        event.currentTarget.classList.add("on");
        alphabetKeyboard.style.display = "block";
      }
      else {
        alphabetKeyboard.style.display = "none";
        alphabetArea.querySelector(".on").innerText = event;
        alphabetArea.querySelector(".on").classList.add("done");
        alphabetArea.querySelector(".on").classList.remove("on");      
        this.checkFill();  
      }
    }
    else {
      alphabetKeyboard.style.display = "none";
      alphabetArea.querySelector(".on").classList.remove("on");
    }    
  }
  action(event) {
    let obj = event.currentTarget;
    let alphabetArea = document.querySelector("#alphabet-area");
    if(obj.classList.contains("none")) {
      return false;
    }    
    if(obj.classList.contains("submit")) {
      alphabetArea.querySelectorAll(".no").forEach(function(v){
        //console.log(v.innerText, v.getAttribute("data-value"))
        if(v.innerText.toLowerCase() === v.getAttribute("data-value")) {
          //v.classList.remove("right");          
        }
        else {
          v.classList.add("wrong");
        }
      })

      if(alphabetArea.querySelectorAll(".wrong").length) {
        document.querySelector(".action .submit").classList.add("none");
        document.querySelector(".action .check").classList.remove("none");
      }
      else {
        document.querySelector(".action .submit").classList.add("none");
        document.querySelector(".action .check").classList.add("none");
        document.querySelector(".cloud-message").style.display = "block";
      }
    }
    if(obj.classList.contains("reset")) {
      document.querySelector(".action .submit").classList.add("none");
      document.querySelector(".action .check").classList.add("none");
      document.querySelector(".action .reset").classList.add("none");
      alphabetArea.querySelectorAll(".no").forEach(function(v){
        v.classList.remove("done", "right", "wrong");
        v.innerText = "";
      })
    }
    if(obj.classList.contains("check")) {
      alphabetArea.querySelectorAll(".wrong").forEach(function(v){
        v.classList.add("right");
        v.classList.remove("wrong");
        v.innerHTML = v.getAttribute("data-value");
      })
      document.querySelector(".action .check").classList.add("none");
    }   
    if(obj.classList.contains("back")) {
      this.props.playOthers();
      return false;
    }
  }
  playAgain(a) {
    document.querySelector(".cloud-message").style.display = "none";
    document.querySelector(".action .reset").classList.add("none");
    let alphabetArea = document.querySelector("#alphabet-area");
    alphabetArea.querySelectorAll(".no").forEach(function(v){
      v.classList.remove("done", "right", "wrong");
      v.innerText = "";
    })
  }
  render() {
    let self = this;
    let data = self.state.data;
    console.log(data)
    return <div id="tapping-activity" style={{backgroundColor:self.state.color}}>
    <div id="alphabet-area" style={{width:data.width +"px", height:data.height + "px", backgroundImage:`url(/games/puzzles/${self.props.data.id}.png)`}}>
    {
      data.list.map(function(v){
        let css = "no";
        let text = "";
        if(v.class === "yes") {
          css = "yes";
          text = v.name;
        }
        return  <a className={css} data-value={v.name} onClick={self.alphabetClick} style={{width:v.width+"px", height:v.height+"px", lineHeight:v.height+"px", left:v.left+"px", top:v.top+"px"}}>{text}</a>
      })
    }
    </div>
    <div className="cloud-message" style={{display:'none'}}>
          <div className="cloud">
          <h1>Wonderful</h1>
              <p>You did a great job!</p>
              <p><button onClick={self.playAgain}>play again</button><button onClick={() => self.props.playOthers()}>play others</button></p>
          </div>
      </div>
    <div id="alphabet-keyboard" style={{display:"none"}}>
      <div className="bg-area" onClick={() => self.alphabetClick()}></div>
      <div className="work-area">
      {
        alphabetString.split("").map(function(v){
          return <button onClick={() => self.alphabetClick(v)}>{v}</button>
        })
      }
      </div>     
    </div>
    <button className="material-icons back" onClick={self.action}>arrow_back</button>
    <div className="action">   
      <button className="material-icons submit none" onClick={self.action}>send</button>
      <button className="material-icons check none" onClick={self.action}>done</button>
      <button className="material-icons reset none" onClick={self.action}>refresh</button>      
      </div>
    </div>
  }
}

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
      width: 0,
      data:shuffle(props.data),
      localData:[],
      index:null,
      colorArray:[],
      color:null,
      score:false
    }
    this.playItem = this.playItem.bind(this);
    this.playOthers = this.playOthers.bind(this);
    
    // host = document.body.getAttribute("data-host");
    // post = document.body.getAttribute("data-post");
  
  }
  componentDidMount() {
    let self = this;
    // fetchData({
    //   method:"getGames",
    //   type:"cluePuzzles"
    // }, function(data){

    //   self.setState({
    //     data:shuffle(data),
    //     localData:[],
    //     //index:0
    //   })      
    // })


   
  }
  playItem (index) {
    this.setState({
      index
    })
  }

  playOthers() {
    this.setState({
      index:null
    })
  }
  render() {
    let self = this;
    let html = "";
    const {page} = self.props;
    if(!self.state.data.length) {
      html = <div>Loading</div>
    }
    
    html = <div className="items-list">
        <h1><a href="https://tinykidszone.com/"><img src="https://tinykidszone.com/images/tkz-logo.png" alt="Tiny Kids Zone" /></a></h1>
        <p>Crossword clue fill Activities, Puzzles and Exercises which helpful to learn new words for your kids.</p>
        <ul>
          {
            self.state.data.map(function(val, i){
              const v = val.data;
              let item = "";
              if(self.state.localData[i]) {
                let missed = parseInt(self.state.localData[i]);
                if(missed <= 10) {
                  item = "star";
                }
                if(missed > 10 && missed < 20) {
                  item = "favorite";
                }
              }
              let style = {
                backgroundImage:`url(/games/puzzles/${v.id}.png)`
              }
              return <li key={v.id} onClick={() => self.playItem(i)}>
                <div><i className={"material-icons"}>{item}</i>
                  <img src={`/images/image-2x1.png`} style={style} alt={v.title} />
                <span>{v.title}</span></div>
              </li>
            })
          }
        </ul>
      </div>
    
    if(self.state.index !== null) {
      html = <Game data={self.state.data[self.state.index].data} key={self.state.index} playOthers={this.playOthers} />
    }
    

    return <div id="root">
     <GameHead data={page} />
   {html}
 </div>
   }
}

export async function getStaticProps() {
  const page = await db.getGames("crossword-puzzles");
  const data = await db.getPuzzles();
  return {
    props: {
      page:page[0].data,
      data
    }
  }
}
export default App;
