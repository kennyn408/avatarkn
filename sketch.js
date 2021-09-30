let mic;
let angle = 0.0;
let jitter = 0.0;
let numBalls = 100;
let spring = 0.1;
let gravity = 0.0;
let friction = -0.05;
let balls = [];

function setup() {
  createCanvas(400, 400);
  
  // Create an Audio input
  mic = new p5.AudioIn();

  // start the Audio Input.
  // By default, it does not .connect() (to the computer speakers)
  mic.start();
  
  for (let i = 0; i < numBalls; i++) {
    balls[i] = new Ball(
      random(width),
      random(height),
      random(3,10),
      i,
      balls
    );
  }
  stroke(255,255,255);
  noFill();
}

function draw() {
  background(0,179,255);
  if (mouseIsPressed) {
    fill(52,131,235);
} else {fill(255,255,255);
        fill(255,255,255);
  //Draw the line from the center and it will also be the
  //rotate around that center
}
  
  ///// WATCH FACE /////
  
  strokeWeight(3);
  stroke(255,255,255);
  ellipse(200,200,225,225);
  
  ///// FOUR CORNER LINES /////
  
  line(115,115,0,0);
  line(400,400,285,285);
  line(0,400,115,285);
  line(400,0,285,115);

  ///// HOUR HAND /////
  
  strokeWeight(5);
  line(200,200,260,200);

  ///// GLASSES LENS /////
  
  fill(52,131,235);
  rect(130,145,60,45);
  fill(52,131,235);
  rect(210,145,60,45);
  
  ///// GLASSES FRAME /////
  
  noStroke();
  rect(100,165,300,15);
  
  fill(255,255,255);
  ellipse(200,200,12,12);
  fill(52,131,235);
  if (mouseIsPressed == true) {
      noFill(); // None
    }
    else {
      fill(52,131,235); // Blue
    }

  // Get the overall volume (between 0 and 1.0)
  let vol = mic.getLevel();
  if (mouseIsPressed == true) {
      fill(255,255,255); // White
    }
    else {
      fill(52,131,235); // Blue
    }
  noStroke();

  ///// MOUTH (MIC INPUT) /////

  // Draw an arc with height based on volume
  let h = map(vol, 0, 1, height, 0);
  arc(width / 2,h - 120,100,100,PI,0,CHORD);
  
  ///// WATCH STRAP /////
  
  fill(255,255,255);
    if (mouseIsPressed == true) {
      fill(52,131,235); // Blue
    }
    else {
      fill(255,255,255); // White
    }
  rect(0,150,100,100);
    if (mouseIsPressed == true) {
      fill(52,131,235); // Blue
    }
    else {
      fill(255,255,255); // White
    }
  rect(300,150,100,100);

  if (mouseIsPressed == true) {
      stroke(52,131,235); // Blue
    }
    else {
      stroke(255,255,255); // White
    }
  line(100,145,100,255);
  if (mouseIsPressed == true) {
      stroke(52,131,235); // Blue
    }
    else {
      stroke(255,255,255); // White
    }
  
  ///// WATCH FACE OUTLINE /////
  
  stroke(255,255,255);
  noFill();
  ellipse(200,200,225,225);
  
  ///// CHILD STICK FIGURE /////
  
  fill(52,131,235);
  noStroke();
  ellipse(50,170,25,25);
  stroke(52,131,235);
  line(50,175,50,215);
  line(40,195,60,195);
  line(50,215,40,230);
  line(50,215,60,230);
  
  ///// EYEBROWS /////
  
  stroke(255,255,255);
  strokeWeight(5);
  line(130,130,175,120);
  line(270,130,225,120);
  
  ///// ADULT STICK FIGURE /////
  
  fill(255,255,255);
  noStroke();
  ellipse(350,170,25,25);
  stroke(255,255,255);
  strokeWeight(5);
  line(350,175,350,230);
  line(330,195,370,195);
  line(350,230,333,248);
  line(350,230,367,248);
  
  ///// MINUTE HAND (MOVING FREELY) /////
  
  // during even-numbered seconds (0, 2, 4, 6...) add jitter to
  // the rotation
  if (second() % 2 === 0) {
    jitter = random(-0.0001, 0.01);
  }
  //increase the angle value using the most recent jitter value
  angle = angle + jitter;
  //use cosine to get a smooth CW and CCW motion when not jittering
  let c = cos(angle);
  //move the shape to the center of the canvas
  translate(width / 2, height / 2);
  //apply the final rotation
  rotate(c);
  rect(0,0,100,0.1);
  
  ///// ROTATING DOTS (MOVING FREELY) /////
  
  balls.forEach(ball => {
    ball.collide();
    ball.move();
    ball.display();
  });
}

class Ball {
  constructor(xin, yin, din, idin, oin) {
    this.x = xin;
    this.y = yin;
    this.vx = 0;
    this.vy = 0;
    this.diameter = din;
    this.id = idin;
    this.others = oin;
  }

  collide() {
    for (let i = this.id + 1; i < numBalls; i++) {
      // console.log(others[i]);
      let dx = this.others[i].x - this.x;
      let dy = this.others[i].y - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = this.others[i].diameter / 2 + this.diameter / 2;
      //   console.log(distance);
      //console.log(minDist);
      if (distance < minDist) {
        //console.log("2");
        let angle = atan2(dy, dx);
        let targetX = this.x + cos(angle) * minDist;
        let targetY = this.y + sin(angle) * minDist;
        let ax = (targetX - this.others[i].x) * spring;
        let ay = (targetY - this.others[i].y) * spring;
        this.vx -= ax;
        this.vy -= ay;
        this.others[i].vx += ax;
        this.others[i].vy += ay;
      }
    }
  }

  move() {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;
    if (this.x + this.diameter / 2 > width) {
      this.x = width - this.diameter / 2;
      this.vx *= friction;
    } else if (this.x - this.diameter / 2 < 0) {
      this.x = this.diameter / 2;
      this.vx *= friction;
    }
    if (this.y + this.diameter / 2 > height) {
      this.y = height - this.diameter / 2;
      this.vy *= friction;
    } else if (this.y - this.diameter / 2 < 0) {
      this.y = this.diameter / 2;
      this.vy *= friction;
    }
  }

  display() {
    ellipse(this.x, this.y, this.diameter, this.diameter);
}
}