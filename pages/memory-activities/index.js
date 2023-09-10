import React from 'react';
import db from "../../components/db";
import {GameHead} from "../../components/helpers";

let host = "", post = "";
const shuffle = function(data) {
  var i = data.length, j, temp;
  if ( i === 0 ) return data;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = data[i];
     data[i] = data[j];
     data[j] = temp;
  }
  return data;
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


const createData = function() {
  let size = 16;
  let data = [];
  let x = -1;
  let y = 0;
  let missed = 0;
  for(var i = 0; i<8 ; i++) {
    x++;
    if(i === 4) {
      y = 1;
      x = 0;      
    }
    data.push({
      i,
      x,
      y
    })
  }
  data = shuffle([...data, ...data]);
  return {
    data,
    size,
    missed,
    image:""
  }
}



class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = createData(props);
    this.tapClick = this.tapClick.bind(this);    
  }
  componentWillMount() {
    this.setState({
      image:this.props.data.image
    })
  }
  // componentWillReceiveProps(props) {
  //   let {data, size, missed, image} = createData(props);
  //   this.setState({
  //     data,
  //     size,
  //     missed,
  //     image:props.data.image
  //   }, function(){
    
  //   })
  // }
  componentDidMount() {
    document.querySelector("footer span").innerText = 0;
  }
  tapClick(event) {
    
    let self = this;
    let missed = this.state.missed;
    // document.querySelectorAll(".puzzle-area div").forEach(function(v){
    //   v.classList.add("done")
    // })
    // if(document.querySelectorAll(".done").length === 16) {
    //   self.props.next();
    // } 
    
    if(event.currentTarget.classList.contains("done")) {
     
    }
    else {
      event.currentTarget.classList.add("on");
      if(document.querySelectorAll(".on").length === 2) {
        let x1 = document.querySelectorAll(".on")[0].getAttribute("data-index");
        let x2 = document.querySelectorAll(".on")[1].getAttribute("data-index");
        setTimeout(function(){
          if(x1 === x2) {
            document.querySelectorAll(".on").forEach(v => {
              v.classList.remove("on");
              v.classList.add("done");              
            });      
            if(document.querySelectorAll(".done").length === 16) {
              self.props.next();
            }      
          }
          else {
            document.querySelectorAll(".on").forEach(v => {
              v.classList.remove("on")
            });
            missed++;
            self.setState({
              missed
            }, function(){
              document.querySelector("footer span").innerText = missed;
            })
          }
        }, 350)
      }
    }
  }
  render() {
    let self = this;
    let taps = "";
    let width = this.props.width;
    taps = self.state.data.map(function(v){
      let style = {
        backgroundImage:`url(${self.state.image})`,
        backgroundSize:width + "px",
        backgroundPosition:"-" + v.x * (width/4) + "px -" + v.y * (width/4) + "px"	
      }
      let classMe = "";
     
      return <div className={classMe} data-index={v.i} style={{width:(width/4) + "px", height:(width/4) + "px"}} onClick={self.tapClick}>
        <img src={`${host}images/image-1x1.png`} style={style} alt="" />
      </div>
    })
    
    return <div className="puzzle-area" data-size={self.state.size} style={{width:width}}>
      {taps}
    </div>
  }
}


const getSetData = function(data) {
  const isServer = typeof window === 'undefined';
  if(isServer) {
    return {activeIndex:0, submit:0, data:{}};
  }
  if(data) {
    localStorage.setItem("tappuzzle", JSON.stringify(data))
  }
  else {
    let localData = {activeIndex:0, submit:0, data:{}};
    if(localStorage.getItem("tappuzzle")) {
      localData = JSON.parse(localStorage.getItem("tappuzzle"));
    }
    else {
      localStorage.setItem("tappuzzle", JSON.stringify(localData))
    }
    return localData;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      data:shuffle(props.data),
      page:props.page,
      localData:getSetData().data,
      index:null,
      popup:false,
      score:null,
      missed:0,
      activeData:null
    }
    this.widthLoad = this.widthLoad.bind(this);
    this.next = this.next.bind(this);
    this.hashChange = this.hashChange.bind(this);
  }
   componentDidMount() {
    let self = this;
    self.setState({
      localData:getSetData().data,
    })
    window.addEventListener('resize', this.widthLoad);   
        
    let hash = window.location.hash.replace("#", "");
    self.hashChange(hash);
    window.addEventListener("hashchange", function(){
      let hash = window.location.hash.replace("#", "");
      self.hashChange(hash);
    }, false);
  }
  widthLoad() {
    let obj = document.querySelector(".puzzle-game");
   
    if(obj) {
      let width = obj.offsetHeight;
      if(obj.offsetWidth  > obj.offsetHeight ) {
        width = obj.offsetHeight;     
      }
      else {
        width = obj.offsetWidth;
      }
      this.setState({
        width:(width - 20)
      })
      document.querySelector(".width-area").style.width = obj.offsetWidth + "px";      
    }

    
    // if(document.querySelector("..puzzle-game").offsetWidth > )
    // if(document.querySelector(".width-area")) {
    //   this.setState({
    //     width:document.querySelector(".width-area").offsetWidth 
    //   })
    // }
  }
  next() {
    let self = this;
    let message = "Better luck next time!";
    let missed = parseInt(document.querySelector("footer span").innerText);
    let data = getSetData();
    if(missed <= 10) {
      message = "Excellent job done!";
      data.data[self.state.index] = missed;
    }
    else if(missed > 10 && missed< 20) {
      message = "Good job done!"  
      data.data[self.state.index] = missed;
    }
    getSetData(data);
    this.setState({
      popup:true,
      missed,
      message
    })
  }
  
  
  playItem(index) {
    let self = this;
    this.setState({
      activeData:null,
      id:null,
      popup:false
    }, function(){
      self.widthLoad();
    })
  }
  hashChange(id) {
    let self = this;
    let data = self.state.data;
    let activeData = null;
    if(data.length) {
      data.forEach(function(v, i){
        if(v.data.id === id) {
          activeData = v;
        }
      })     
    }
    self.setState({
      activeData,
      id
    }, function(){
      if(activeData) {
        self.widthLoad()
      }
    })
  }
  render() {
    let self = this;
    let {page} = self.state;
    let html = "";
    if(!self.state.data.length) {
        html = <div>loading</div>
    }
    html = <div className="items-list">
      <h1><a href="https://tinykidszone.com/"><img src="https://tinykidszone.com/images/tkz-logo.png" alt="Tiny Kids Zone" /></a></h1>
        <p>Play memory activities, puzzles and exercises which helpful to improved your kids memory.</p>
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
                backgroundImage:`url(${v.image})`
              }
              return <li key={v.id}>
                <a href={`#${v.id}`}><i className={"material-icons"}>{item}</i>
                  <img src={`/images/image-1x1.png`} style={style} alt={v.title} />
                <span>{v.title}</span></a>
              </li>
            })
          }
        </ul>
      </div>
    
    
    let popup = null;
    if(self.state.popup) {
      popup = <div className="message">
      <div className="message-box">
        <div>
        
        <p>{self.state.message}</p>        
        <h4>Your Scroll {self.state.missed}</h4>
          <button className="submit" onClick={() => self.playItem(null)}  data-type="submit">done</button>      
      </div>
      </div>
    </div>
    }
    if(self.state.activeData) {

        let data = self.state.activeData.data;
        html = <div id="puzzle">
        <header><a className="material-icons back" href="#">arrow_back</a><h1>{data.title}</h1></header>
        <div className="puzzle-game" data-missed="0">
        <img src={`/images/image-1x1.png`} className="width-area" alt="" />
        <Game key={this.state.id} width={this.state.width} data={data} next={this.next} />
        </div>
        <footer><strong>Puzzle Missed : <span>0</span></strong></footer>
    
        {popup}
    
      </div>
    }

  return  <div id="root">
    <GameHead data={page} />
 {html}
 </div>
  }
}
export async function getStaticProps() {
  const page = await db.getGames("memory-activities");
  const data = await db.getTapPuzzle();
  return {
    props: {
      page:page[0].data,
      data
    }
  }
}

export default App;
