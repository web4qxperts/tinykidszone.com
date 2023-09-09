import Head from "next/head";
import db from "../../components/db";
import React from 'react';

let host = "", post = "";
let $;

const getXY = function(a) {
  return {
    x:parseInt($(a).css("left").replace("px", "")) + ($(a).width()/2),
    y:parseInt($(a).css("top").replace("px", "")) + ($(a).height()/2)
  }
}

const getMode = function(mode, a) {
  return parseInt((mode/100)*a) + "px"
}

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

let droppableEle;
let resultData = {
  total:0,
  right:0,
  wrong:0,
  play:0
}
const checkAnswer = function(data, mode) {
  let matchingArea = $("#matching-area");
  let svgArea = document.querySelector("svg");
  $(svgArea).find("line").remove();
  let itemIndex = 0;
  data.list.forEach(function(v, i){
    if(parseInt(v.width) === 60 && parseInt(v.height) === 60) {
      let css = "drag";
      if(v.name.indexOf("drop_") !== -1) {
        css = "drop";
      }
      matchingArea.append(`<a class="${css}" data-value="${v.name}" data-left="${getMode(mode, v.left)}" data-top="${getMode(mode, v.top)}"></a>`);
      matchingArea.find("a").eq(itemIndex).css({
        "width":getMode(mode, v.width),
        "height":getMode(mode, v.height),
        "line-height":getMode(mode, v.height),
        "left":getMode(mode, v.left),
        "top":getMode(mode, v.top),
      })
      itemIndex++;
    }
  })

  $(".drag").each(function(){
    var tag = document.createElementNS("http://www.w3.org/2000/svg",'line');
    svgArea.appendChild(tag);
    tag.setAttribute("style", "stroke:green;stroke-width:3" );
    tag.setAttribute("id", $(this).attr("data-value"));
    let index = $(this).attr("data-value").replace("drag_", "");
   $(tag).attr({
      x1:getXY(this).x,
      y1:getXY(this).y,
      x2:getXY($(".drop[data-value='drop_"+index+"']")).x,
      y2:getXY($(".drop[data-value='drop_"+index+"']")).y
   })
    //getXY
  })
}
const createElements = function(matchingArea, svgArea, data, mode, type) {
  data.list.forEach(function(v, i){
    let css = "drag left";
    if(v.name.indexOf("drop_") !== -1) {
      css = "drop left";
    }
    if(type) {
      css = "drop right";
      if(v.name.indexOf("drop_") !== -1) {
        css = "drag right";
      }
    }
    let cssMain = "";
    if(parseInt(v.width) === 60 && parseInt(v.height) === 60) {
      cssMain = "drag-main";
      if(v.name.indexOf("drop_") !== -1) {
        cssMain = "drop-main";
      }
      if(type) {
        cssMain = "drop-main";
        if(v.name.indexOf("drop_") !== -1) {
          cssMain = "drag-main";
          resultData.total++;
        }
        
      }
    }
    matchingArea.append(`<a class="${css} ${cssMain}" data-value="${v.name}" data-index="${i}" data-left="${getMode(mode, v.left)}" data-top="${getMode(mode, v.top)}"></a>`);
    let itemsA = matchingArea.find("a.left");
    if(type) {
      itemsA = matchingArea.find("a.right");
    }
    itemsA.eq(i).css({
      "width":getMode(mode, v.width),
      "height":getMode(mode, v.height),
      "line-height":getMode(mode, v.height),
      "left":getMode(mode, v.left),
      "top":getMode(mode, v.top),
    })
  })

  let items = $(".drag.left");
  if(type) {
    items = $(".drag.right");
  }

  items.each(function(i){
    if(!$(svgArea).find("line[id='"+$(this).attr("data-value")+"']").length) {
      var tag = document.createElementNS("http://www.w3.org/2000/svg",'line');
      svgArea.appendChild(tag);
      tag.setAttribute("style", "stroke:rgb(0,0,0);stroke-width:3" );
      tag.setAttribute("id", $(this).attr("data-value"));
    }

    let line = $(svgArea).find("line[id='"+$(this).attr("data-value")+"']");
    $( this ).draggable({
      start: function() {
        line.attr({
          x1:getXY(this).x,
          y1:getXY(this).y
        })
      },
      drag: function() {
        line.attr({
          x2:getXY(this).x,
          y2:getXY(this).y
        })
      },
      stop: function() {
        if($(this).is(".done")) {
          $(this).css({
            "left":$(this).attr("data-left"),
            "top":$(this).attr("data-top"),
          })
          let dragIndex, dropIndex, dragMain, dropMain;
          if($( droppableEle ).is(".good")) {
            line.attr({"data-answer":"good"})
          }
          else {
            line.attr({"data-answer":"bad"})
          }
          
          if(type) {
            // dragIndex = $( this ).attr("data-index");
            // dropIndex = $( droppableEle ).attr("data-index");

            // dragMain = $(".drag-main.right[data-index='"+dragIndex+"']");
            // dropMain = $(".drop-main.right[data-index='"+dropIndex+"']");

            dragIndex = $( this ).attr("data-value").replace("drop_", "");
            dropIndex = $( droppableEle ).attr("data-value").replace("drag_", "");
           
            dragMain = $(".drag-main.right[data-value='drop_"+dragIndex+"']");
            dropMain = $(".drop-main.right[data-value='drag_"+dropIndex+"']");

            
          }
          else {
            // dragIndex = $( this ).attr("data-index");
            // dropIndex = $( droppableEle ).attr("data-index");

            // dragMain = $(".drag-main.left[data-index='"+dragIndex+"']");
            // dropMain = $(".drop-main.left[data-index='"+dropIndex+"']");

            dragIndex = $( this ).attr("data-value").replace("drag_", "");
            dropIndex = $( droppableEle ).attr("data-value").replace("drop_", "");

            dragMain = $(".drag-main.left[data-value='drag_"+dragIndex+"']");
            dropMain = $(".drop-main.left[data-value='drop_"+dropIndex+"']");
          }
         
          line.attr({
            x1:getXY(dragMain).x,
            y1:getXY(dragMain).y,
            x2:getXY(dropMain).x,
            y2:getXY(dropMain).y
          })

          $('[data-value="'+dragMain.attr("data-value")+'"]').remove();
          $('[data-value="'+dropMain.attr("data-value")+'"]').remove();

          
          
         
          if(type) {
            
          
            //$(".right[data-value='drop_"+dragIndex+"'], .left[data-value='drag_"+dragIndex+"']").remove();
            //$(".right[data-value='drag_"+dropIndex+"'], .left[data-value='drop_"+dropIndex+"']").remove();
          }
          else {
            // $("[data-value='drag_"+dragIndex+"']").remove();
            // $("[data-value='drop_"+dropIndex+"']").remove();      
            // $(".left[data-value='drag_"+dragIndex+"'], .right[data-value='drop_"+dragIndex+"']").remove();
            // $(".left[data-value='drop_"+dropIndex+"'], .right[data-value='drop_"+dropIndex+"']").remove();
          }
             
        }
        else {
          line.attr({
            x2:line.attr("x1"),
            y2:line.attr("y1"),
          })  
          $(this).css({
            "left":$(this).attr("data-left"),
            "top":$(this).attr("data-top"),
          })          
        }
      }
    })
  })

  let items2 = $(".drop.left");
  if(type) {
    items2 = $(".drop.right");
  }
  items2.droppable({
    drop: function( event, ui ) {
      let dragValue = $(ui.draggable).attr("data-value");
      if(type) {
        $(".drag.right[data-value='"+dragValue+"']").css("visibility", "hidden");
        $(".drag.right[data-value='"+dragValue+"']").addClass("done");

        if($( this ).attr("data-value").replace("drag_", "") === $( ui.draggable ).attr("data-value").replace("drop_", "")) {
          $(this).addClass("good");
          resultData.right++;     
        }
        else {
          $(this).addClass("bad");
          resultData.wrong++;
        }
      }
      else {
        $(".drag.left[data-value='"+dragValue+"']").css("visibility", "hidden");
        $(".drag.left[data-value='"+dragValue+"']").addClass("done");

        if($( this ).attr("data-value").replace("drop_", "") === $( ui.draggable ).attr("data-value").replace("drag_", "")) {
          $(this).addClass("good");
          resultData.right++;     
        }
        else {
          $(this).addClass("bad");
          resultData.wrong++;
        }
      }
      

      resultData.play++
      droppableEle = this;

     
      //console.log(resultData);
      $("button.reset").removeClass("none");
      if(resultData.play === resultData.total) {
        $("button.submit").removeClass("none");
      }
    }
  });
  //console.log(resultData);
}
const isDragReady = function(data, mode) {
  
  let matchingArea = $("#matching-area");
  matchingArea.find(".drag, .drop").remove();

  let svgArea = document.querySelector("svg");
  $(svgArea).find("line").remove();

  resultData = {
    total:0,
    right:0,
    wrong:0,
    play:0
  }

  createElements(matchingArea, svgArea, data, mode);
  createElements(matchingArea, svgArea, data, mode, true);
  //checkAnswer(data, mode)
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      image:props.data.image,
      color:props.data.color,
      data:JSON.parse(props.data.data),
      mode:0
    }
    this.resizeArea = this.resizeArea.bind(this);
    this.getMode = this.getMode.bind(this);
    this.action = this.action.bind(this);
    this.playAgain = this.playAgain.bind(this);
    
    $ = window.$
    
  }

  action(event) {
    if(window.$(event.currentTarget).is(".none")) {
      return false;
    }
    if(window.$(event.currentTarget).is(".submit")) {
      window.$("#matching-activities").addClass("game-over");
      window.$(".action .check").removeClass("none");
      window.$(".action .submit").addClass("none");
      console.log(resultData);
      if(resultData.total === resultData.right) {
        //hey you done good job
        window.$(".cloud-message").css("display","block");
        window.$(".action .check").addClass("none");
      }
      else {
        $("line[data-answer]").each(function(){
          if($(this).attr("data-answer") === "good") {
            $(this).attr("style", "stroke:green;stroke-width:3")
          }
          else {
            $(this).attr("style", "stroke:red;stroke-width:3")
          }
        })
      }
    }
    if(window.$(event.currentTarget).is(".reset")) {
      window.$(".action .reset").addClass("none");
      window.$(".action .check").addClass("none");
      window.$(".action .submit").addClass("none");
      window.$(".cloud-message").css("display","none");
      this.resizeArea();
    }
    if(window.$(event.currentTarget).is(".check")) {
      //console.log(this.state.data, this.state.mode);
      checkAnswer(this.state.data, this.state.mode);
      window.$(".action .check").addClass("none");
      return false;
    }
    if(window.$(event.currentTarget).is(".back")) {
      this.props.playOthers()
      return false;
    }
    
  }
  resizeArea() {
    let self = this;
    let data = self.state.data;
    let w = window.$(window).width();
    let h = window.$(window).height();
    let dataW = w;
    let dataH = (w * data.height)/data.width;
    
    
    if(w > h) {
      dataW = (h * data.width)/data.height;
      dataH = h;    
    }
  
    if(dataW > w) {
      dataW = w;
      dataH = (w * data.height)/data.width;
    }
    
    
    let mode = (dataW/data.width)*100;
    
    self.setState({
      mode,
      width:dataW,
      height:dataH
    }, function(){
      isDragReady(self.state.data, mode);
    })
    //matchingArea.style.transform = `translate(-50%, -50%) scale(${scale})`; 
  }
  componentDidMount() {
    let self = this;
    self.resizeArea();
    window.addEventListener('resize', function(){
      self.resizeArea();
    });
    
  }
  
  
  getMode(a) {
    return parseInt((this.state.mode/100)*a) + "px"
  }
  playAgain(a) {
    window.$(".cloud-message").css("display","none");
    window.$(".action .reset").addClass("none");
    this.resizeArea();
  }

 
  render() {
    let self = this;
    let data = self.state.data;
    return <div id="matching-activities" style={{background:self.state.color}}>
    <div id="matching-area" style={{width:self.getMode(data.width), height:self.getMode(data.height), backgroundImage:"url("+self.state.image+")"}}>
      <svg width={self.getMode(data.width)} height={self.getMode(data.height)} xmlns="http://www.w3.org/2000/svg"></svg>
    </div>
    <button className="material-icons back" onClick={self.action}>arrow_back</button>
    <div className="action">   
      <button className="material-icons submit none" onClick={self.action}>send</button>
      <button className="material-icons check none" onClick={self.action}>done</button>
      <button className="material-icons reset none" onClick={self.action}>refresh</button>      
      </div>
      <div className="cloud-message" style={{display:'none'}}>
          <div className="cloud">
          <h1>Wonderful</h1>
              <p>You did a great job!</p>
              <p><button onClick={self.playAgain}>play again</button><button onClick={() => self.props.playOthers()}>play others</button></p>
          </div>
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
  constructor() {
    super();
    this.state = {
      width: 0,
      data:[],
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
    //   type:"matchingPuzzles"
    // }, function(data){

      

    //   self.setState({
    //     data:shuffle(data),
    //     localData:[],
    //     //index:0
    //   })
    // })

    db.getMatchingActivities().then(function(data){
      console.log(data);
      self.setState({
        data:shuffle(data),
        localData:[]
      })
    })
    
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
    if(!self.state.data.length) {
      html = <div>Loading</div>
    }
    if(self.state.index === null) {
      html = <div className="items-list">
        <h1><a href="https://tinykidszone.com/"><img src="https://tinykidszone.com/images/tkz-logo.png" alt="Tiny Kids Zone" /></a></h1>
        <p>Crossword clue fill ctivities, puzzles and exercises which helpful to learn new words for your kids.</p>
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
              return <li key={v.id} onClick={() => self.playItem(i)}>
                <div><i className={"material-icons"}>{item}</i>
                  <img src={`/images/image-2x1.png`} style={style} alt={v.title} />
                <span>{v.title}</span></div>
              </li>
            })
          }
        </ul>
      </div>
    }

    if(self.state.index !== null) {
      html = <Game data={self.state.data[self.state.index].data} key={self.state.index} playOthers={this.playOthers} />
    }

    

    return <div id="root">
    <Head>
       <title>Ravi</title>
       <link href="/css/game.css" rel="stylesheet"/>
       <link href="/css/matching-activities.css" rel="stylesheet"/>
   </Head>
   {html}
 </div>
   }
}


export default App;
