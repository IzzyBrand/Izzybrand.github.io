var buttonSize, ballSize, menuSize, menuHalfSize, ballBottom;
var selectedInstrument = -1;
var ballColor;
var balls, instruments;
var gravity = 0.1;
var startX = -1, startY;
var drawingNewCircle = false;


function setup() {
  createCanvas(windowWidth, windowHeight);
  buttonSize = windowHeight/12;
  ballSize = windowHeight/20;
  menuSize = windowHeight/8;
  menuHalfSize = menuSize/2;
  ballBottom = windowHeight * 7/6;
  ballColor = color(255);
  balls = new Array();
  instruments = new Array();
  instruments.push(new Instrument(color(150,41,246), loadSound("clips/boop.mp3")))
  instruments.push(new Instrument(color(130, 210,43), loadSound("clips/bounce.mp3")))
  instruments.push(new Instrument(color(62, 215, 247), loadSound("clips/drop.mp3")))
  instruments.push(new Instrument(color(247, 212, 8), loadSound("clips/metalClack.mp3")))
  instruments.push(new Instrument(color(236, 23, 149), loadSound("clips/pop.mp3")))
  instruments.push(new Instrument(color(247, 151, 0), loadSound("clips/tick.mp3")))
}


///////////////////////////////////////////////////////////////////////////////////////
// DRAW
///////////////////////////////////////////////////////////////////////////////////////
function draw() {
  background(50);
  // UPDATE BALLS
  for (var i = 0; i < balls.length; i++) {
    balls[i].display();
    if (balls[i].y > ballBottom || balls[i].x < 0 || balls[i].x > windowWidth + ballSize) balls.slice(i,1);
    
    for (var j = 0; j < instruments.length; j++) {
      instruments[j].checkCollision(balls[i])
    }
  }
  
  // UPDATE INSTRUMENTS
  fill(0,0);
  for (var i = 0; i < instruments.length; i++) {
    instruments[i].display();
  }
  
  
    // DRAW MENU
  noStroke();
  fill(30);
  rect(0,0, menuSize, windowHeight);
  fill(ballColor);
  ellipse(menuHalfSize, menuHalfSize, buttonSize);
  for (var i = 0; i < instruments.length; i++) {
    fill(instruments[i].c);
    ellipse(menuHalfSize, menuHalfSize + (i + 1) * menuSize, buttonSize);
  }
  
  // DRAW MOUSE and current circle
  strokeWeight(2)
  fill(0,0);
  if (selectedInstrument >= 0) {
    stroke(instruments[selectedInstrument].c);
    // draw realtime circle if we are currently drawing one
    if (drawingNewCircle) {
      ellipse(startX, startY, pythag(startX, startY, mouseX, mouseY)*2)
    }
  }
  else stroke(ballColor);
  ellipse(mouseX, mouseY, ballSize, ballSize);
}

///////////////////////////////////////////////////////////////////////////////////////
// MOUSE EVENTS
///////////////////////////////////////////////////////////////////////////////////////
function mouseClicked() {
  if (mouseX < menuSize) {
    if (mouseY < menuSize) selectedInstrument = -1;
    else {
      for (var i = 0; i < instruments.length; i++) {
        if (mouseY > (i + 1) * menuSize && mouseY < (i + 2) * menuSize) {
          selectedInstrument = i;
          instruments[selectedInstrument].playSound();
        }
      }
    }
  }
  else if (selectedInstrument < 0) {
    balls.push(new Ball(mouseX, mouseY));
  }
}

function mousePressed() {
  if (mouseX > menuSize && selectedInstrument >= 0) {
    drawingNewCircle = true;
    startX = mouseX;
    startY = mouseY;
  }
}

function mouseReleased() {
  if (mouseX > menuSize && drawingNewCircle && selectedInstrument >= 0) {
    instruments[selectedInstrument].addCircle(startX, startY, mouseX, mouseY);
    drawingNewCircle = false;
  }
  else drawNewCircle = false;
}


///////////////////////////////////////////////////////////////////////////////////////
// CLASSES
///////////////////////////////////////////////////////////////////////////////////////
function Instrument(c, s) {
  this.c = c;
  this.circles = new Array();
  this.s = s;
  
  this.addCircle = function(x1,y1,x2,y2) {
    var r = pythag(x1,y1,x2,y2);
    this.circles.push(new Circle(x1,y1,r,c));
  }
  
  this.display = function() {
    strokeWeight(2);
    stroke(c);
    for (var i = 0; i < this.circles.length; i++) {
      this.circles[i].display();
    }
  }
  
  this.playSound = function() {
    this.s.play();
  }
  
  this.checkCollision = function(ball) {
    for (var i = 0; i < this.circles.length; i++) {
      var centerToCenter = pythag(ball.x, ball.y, this.circles[i].x, this.circles[i].y);
      var minDist = ballSize/2 + this.circles[i].r
      if (centerToCenter < minDist) {
        var perpNorm = arctan(ball.x, ball.y, this.circles[i].x, this.circles[i].y);
        var traj = atan(ball.yv/ball.xv);
        var newTraj = - perpNorm * 2 + traj;
        var vel = pythag(ball.xv, ball.yv, 0,0);
        ball.xv = cos(newTraj) * vel;
        ball.yv = sin(newTraj) * vel;
        ball.x += (ball.x - this.circles[i].x) * (minDist/centerToCenter - .999);
        ball.y += (ball.y - this.circles[i].y) * (minDist/centerToCenter - .999);
        this.playSound()
      }
    }
  }
}

function Circle(x,y,r,c) {
  this.x = x;
  this.y = y
  this.r = r;
  this.c = c;
  
  this.display = function() {
    ellipse(this.x, this.y, this.r*2, this.r*2);
  }
}

function Ball(x,y) {
  this.x = x;
  this.y = y;
  this.xv = 0;
  this.yv = 0;
  
  this.display = function() {
    this.x += this.xv;
    this.y += this.yv;
    this.yv += gravity;
    noStroke();
    fill(ballColor);
    ellipse(this.x, this.y, ballSize, ballSize);
  }
}

///////////////////////////////////////////////////////////////////////////////////////
// OTHER FUNCS
///////////////////////////////////////////////////////////////////////////////////////
function pythag(x1,y1,x2,y2) {
  return sqrt(sq(x1 - x2) + sq(y1 - y2));
}

function arctan(x1,y1,x2,y2) {
  return atan((y2 - y1)/(x1 - x2));
}