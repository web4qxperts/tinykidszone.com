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

let wrong;
let right;
let mode;
const getMode = function(v) {
  if(mode) {
    return (mode/100)*v;
  }
  else {
    return v;
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


const dragDrop = function(data) {
  let $ = window.$;
  var thisObj = $("#dragDropGame");
  var image = `/games/drag-drop/image-over-${data.id}.png`;
  let gameType = data.type;
  
  let missed = 0;

  thisObj.find(".drag, .drop").remove();
  thisObj.removeClass("game-over");
  $(".action").removeClass("orientation")
  $(".action button").addClass("none");
  $(".action .back").removeClass("none");
  
  
  data = JSON.parse(data.data);

  let w = $(window).width();
  let h = $(window).height();
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
  
  
  mode = (dataW/data.width)*100;
  thisObj.width(dataW);
  thisObj.height(dataH);
 
  
  var a = [];
  $.each(data.list, function(i, v){
    //a.push(i);
    let type = v.name.replace("drag_", "").replace("drop_", "")
    if(v.name.indexOf("drag_") !== -1) {
      
      thisObj.append('<div class="drag drag'+i+'" index="'+i+'" data-type="'+type+'"><img src="'+image+'" /></div>');
      var drag = $(".drag" + i);
      drag.width(getMode(v.width)).height(getMode(v.height)).css("left", getMode(v.left) + "px").css("top", getMode(v.top) + "px")
      drag.find("img").width(dataW).height(dataH).css("left", "-" + getMode(v.left) + "px").css("top", "-" + getMode(v.top) + "px");
      
    }
    else {
      if(v.name.indexOf("drop_") !== -1) {
        thisObj.append('<div class="drop drop'+i+'" index="'+i+'" data-type="'+type+'"><img src="'+image+'"></div>');
        var drag = $(".drop" + i);
        drag.width(getMode(v.width)).height(getMode(v.height)).css("left", getMode(v.left) + "px").css("top", getMode(v.top) + "px")
        drag.find("img").width(dataW).height(dataH).css("left", "-" + getMode(v.left) + "px").css("top", "-" + getMode(v.top) + "px");
      }  
    }
    
    
    
    
    
  })

  $(".drag").each(function(i){
    let dataType = $(this).attr("data-type");
    
    $(this).draggable({
          revert: true,
          revertDuration: 0,
          //containment: "#dragDropGame",
          stop: function(event, ui) {
            if($(this).is(".drag-hide")) {
              //right.play();          
            }
            else {
              //wrong.play();
              missed++          
            }
          }
        });
  })
  
  if(gameType == 1) {
    $(".drop").each(function(i){
      let dataType = $(this).attr("data-type");
      $(this).droppable({
        //accept: ".drag[data-type='"+dataType+"']",
        accept: ".drag",
        drop:function(event, ui){
          if(!$(this).is(".drop-show")) {
            $(".action .reset").removeClass("none");
            let cloneEle = $(ui.draggable).clone();
            if(dataType === $(ui.draggable).attr("data-type")) {
              
     
              $(this).append('<i class="right"></i>');
              $(this).find("i").css({
                width:getMode(36) + "px",
                height:getMode(36) + "px"
              })
            }
            else {
              $(this).append('<i class="wrong"></i>');
              $(this).find("i").css({
                width:getMode(36) + "px",
                height:getMode(36) + "px"
              })
             // $(this).find("i").attr("class", "wrong")
              //$(this).append('<span class="material-icons wrong">clear</span>');
            }
            $(ui.draggable).addClass("drag-hide");
            cloneEle.css({left:0,top:0})
            $(this).addClass("drop-show").append(cloneEle);		
            if($(".drop-show").size() === $(".drop").length){
              $(".action .submit").removeClass("none");
              
            }
          }
        }
      });
    })
  }
  else {
    $(".drop").each(function(i){
      let dataType = $(this).attr("data-type");
      $(this).droppable({
        accept: ".drag[data-type='"+dataType+"']",
        drop:function(event, ui){
          if(!$(this).is(".drop-show")) {
            let cloneEle = $(ui.draggable).clone( true );
            $(ui.draggable).addClass("drag-hide");
            cloneEle.css({left:0,top:0})
            $(this).addClass("drop-show").append(cloneEle);		
            window.$(".action .reset").removeClass("none")
            if($(".drop-show").size() === $(".drop").length){
              $(".alert").addClass("show");
              if(missed === 0) {
                $(".alert").find("p").text("Excellent job done by you!");
              }
              else {
                $(".alert").find("p").html("Well played but you missed <span>"+missed+"</span>  times!");
              } 
            }
          }
        }
      });
    })
  }

  
  a =shuffle(a);
  var dragW = 0;
  // $.each(a, function(i, v){
  //   dragW += $(".drag[index='"+i+"']").width();
  //   $(".drag[index='"+v+"']").appendTo(".drag-area");			
  			
  // })

  var margin = parseInt(((dataW - dragW)/data.list.length)/2) - 1;
  //$(".drag").css("margin", "10px "+margin+"px")	
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.playAgain = this.playAgain.bind(this);
    this.action = this.action.bind(this);
    
  }
  componentDidMount() {
    let self = this;
    dragDrop(self.props.data);
    window.addEventListener('resize', function(){
      dragDrop(self.props.data);
    });
  }
  playAgain() {
    window.$(".alert").removeClass("show");
    window.$(".cloud-message").css("display","none");
    dragDrop(this.props.data);
  }
  action(event) {
    if(window.$(event.currentTarget).is(".none")) {
      return false;
    }
    if(window.$(event.currentTarget).is(".submit")) {
     
      if(window.$("#dragDropGame i.wrong").length) {
        window.$("#dragDropGame").addClass("game-over");
        window.$(".action .check").removeClass("none");
      }
      else {
        window.$(".cloud-message").css("display","block");
        window.$(".action .check").addClass("none");
      }

    }
    if(window.$(event.currentTarget).is(".reset")) {
      window.$(".alert").removeClass("show");
      window.$(".cloud-message").css("display","none");
      window.$(".action .reset").addClass("none");
      dragDrop(this.props.data);
    }
    if(window.$(event.currentTarget).is(".check")) {
      let typeData = [];
      window.$(".drop").each(function(){
        let rightDrop = window.$(this);
        rightDrop.find(".drag").remove();
        rightDrop.find("span").remove();
        let type = window.$(this).attr("data-type");
        if(typeData.indexOf(type) === -1) {
          typeData.push(window.$(this).attr("data-type"));
        }
      })
      typeData.forEach(function(type){
        window.$(".drop[data-type='"+type+"']").each(function(i){
          let rightDrop = window.$(this);
          let cloneItem = window.$(".drag.drag-hide[data-type='"+type+"']").eq(i).clone();
          cloneItem.removeClass("drag-hide").css({
          left:0,
          top:0
          })
          rightDrop.append(cloneItem);
          window.$(".action .submit, .action .check").addClass("none");
          window.$(".action .reset").removeClass("none");
          rightDrop.find("i").attr("class", "right");
        })
      })
      
      // window.$(".drag").each(function(){
      //   let type = window.$(this).attr("data-type");
      //   let rightDrop = window.$(".drop[data-type='"+type+"']");
      //   rightDrop.find(".drag").remove();
      //   rightDrop.find("span").remove();
      //   let cloneItem = window.$(this).clone();
      //   cloneItem.removeClass("drag-hide").addClass("clone-ready").css({
      //     left:0,
      //     top:0
      //   });
      //   rightDrop.append(cloneItem);
      //   window.$(".action button").addClass("none");
      //   window.$(".action .reset").removeClass("none")
      // })
      return false;
    }
    if(window.$(event.currentTarget).is(".back")) {
      this.props.playOthers()
      return false;
    }
    
  }
  
  render() {
    let self = this;
    let data = self.props.data;
    let actionClass =  "";
    if(data.type == 2) {
      actionClass = "action-2";
    }
    return  <div className="bg-area" style={{backgroundImage:"url(/games/drag-drop/bg-"+data.id+".png)"}}>
    <section id="dragDropGame" style={{backgroundImage:"url(/games/drag-drop/image-"+data.id+".png)"}}>
  
     
    </section>
    <a className="material-icons back" href="#">arrow_back</a>
    <div className={`action ${actionClass}`}>   
      <button className="material-icons submit none" onClick={self.action}>send</button>
      <button className="material-icons check none" onClick={self.action}>done</button>
      <button className="material-icons reset none" onClick={self.action}>refresh</button>      
      </div>
      <div className="cloud-message" style={{display:'none'}}>
          <div className="cloud">
          <h1>Wonderful</h1>
              <p>You did a great job!</p>
              <p><a onClick={this.playAgain}>play again</a><a href="#">play others</a></p>
          </div>
      </div>
    <div className="alert">
        <div>
          <p></p>
          <button onClick={this.playAgain}>Play Again</button>
          <button onClick={() => this.props.playOthers()}>Play Others</button>
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
      data:shuffle(props.data),
      localData:[],
      index:null,
      id:null,
      activeData:null,
      colorArray:[],
      color:null,
      score:false
    }
    this.playItem = this.playItem.bind(this);
    this.playOthers = this.playOthers.bind(this);
    this.hashChange = this.hashChange.bind(this);
    
    
    // host = document.body.getAttribute("data-host");
    // post = document.body.getAttribute("data-post");

    // wrong = new Audio(host + "/games/audio/wrong.mp3");
    // right = new Audio(host + "/games/audio/right.mp3");    
  }
  componentDidMount() {
    let self = this;
    // fetchData({
    //   method:"getGames",
    //   type:"dragdrop"
    // }, function(data){
    //   self.setState({
    //     data:shuffle(data),
    //     localData:[],
    //     //index:0
    //   }, function(){
    //     let hash = window.location.hash.replace("#", "");
    //     self.hashChange(hash);
    //   })      
    // })
   
    let hash = window.location.hash.replace("#", "");
    self.hashChange(hash);  
    window.addEventListener("hashchange", function(){
      let hash = window.location.hash.replace("#", "");
      self.hashChange(hash);
    }, false);
  }
  playItem (index) {
    this.setState({
      index
    })
  }

  playOthers() {
    this.setState({
      activeData:null
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
    })
  }
  render() {
    let self = this;
    let {page} = self.props;
    if(!self.state.data.length) {
      return <div>Loading</div>
    }
      let html = <div className="items-list">
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
                backgroundImage:`url(/games/drag-drop/bg-${v.id}.png)`
              }
              return <li key={v.id}>
                <a href={`/drag-and-drop-activities#${v.id}`}><i className={"material-icons"}>{item}</i>
                  <img src={`/images/image-1x1.png`} style={style} alt={v.title} />
                <span>{v.title}</span></a>
              </li>
            })
          }
        </ul>
      </div>
    
    if(self.state.activeData) {
      html = <Game data={self.state.activeData.data} key={self.state.id} playOthers={this.playOthers} />
    }
     

    return <div id="root">
         <GameHead data={page} />
        {html}
      </div>
   }
}

export async function getStaticProps() {
  const page = await db.getGames("drag-and-drop-activities");
  const data = await db.getDragDrop();
  return {
    props: {
      page:page[0].data,
      data
    }
  }
}
export default App;
