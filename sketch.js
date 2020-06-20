var balls = []; // empty array
var r = 12
var population = 10
var bottom = 90
var highlight = null;

function setup() {
  //noLoop()
  createCanvas(600, 400);
  // create sliders
  popSlider = createSlider(0, 100, population, 1);
  popSlider.position(width - 20 - popSlider.width, 30);
  prevSlider = createSlider(0, 1, .1, 0.01);
  prevSlider.position(20, height - 80);
  senSlider = createSlider(0, 1, 0.9, 0.01);
  senSlider.position(20, height - 50);
  spSlider = createSlider(0, 1, 0.9, 0.01);
  spSlider.position(20, height - 20);
  // for loop is used to create multiple ball objects
  for (var i = 0; i < population; i++) {
    balls[i] = new Ball(random(0, width - 2 * r), random(0, height - bottom - 2 * r));
  }
}

function draw() {
  // go over every ball in array
  background(222);
  const prevalence = prevSlider.value();
  const sensitivity = senSlider.value();
  const specificity = spSlider.value();

  if (popSlider.value() > population) {
    //add 
    for (var i = 0; i < popSlider.value() - population; i++) {
      balls.push(new Ball(random(0, width - 2 * r), random(0, height - bottom - 2 * r)));
    }
    population = popSlider.value()
  }
  if (popSlider.value() < population) {
    //sub
    balls = balls.slice(0, -1 * (population - popSlider.value()))
    population = popSlider.value()
  }

  let number_diseased = (population * prevalence);
  var TP = (population * prevalence * sensitivity);
  var TN = (population * (1 - prevalence) * specificity);
  var FN = (population * prevalence * (1 - sensitivity));
  var FP = (population * (1 - prevalence) * (1 - specificity));
  var res = null;
  for (var i = 0; i < balls.length; i++) {
    if (i < round(number_diseased)) {
      balls[i].diseased = true
    } else {
      balls[i].diseased = false
    }
  }
  let c = 0
  for (var i = 0; i < balls.length; i++) {
    var res = null;
    if (balls[i].diseased && c < round(TP)) {
      balls[i].test_result = true
      balls[i].res = 0
      c++
    } else if (balls[i].diseased) {
      //all those diseased that are not TP are FN
      balls[i].test_result = false
      balls[i].res = 2
    }

  }
  c = 0
  for (var i = 0; i < balls.length; i++) {
    var res = null;
    if (!balls[i].diseased && c < round(TN)) {
      balls[i].test_result = false
      balls[i].res = 3
      c++
    } else if (!balls[i].diseased) {
      //all those not diseased that are not TN are FP 
      balls[i].test_result = true
      balls[i].res = 1
    }


  }

  for (var i = 0; i < balls.length; i++) {
    balls[i].update();
    balls[i].display();
    balls[i].bounce();

  }
  noStroke()
  text(`Prevalence: ${round(prevalence*100)}%`, prevSlider.x * 1.5 + prevSlider.width, prevSlider.y + prevSlider.height);
  text(`Sensitivity: ${round(sensitivity*100)}%`, senSlider.x * 1.5 + senSlider.width, senSlider.y + prevSlider.height);
  text(`Specificity: ${round(specificity*100)}%`, spSlider.x * 1.5 + spSlider.width, spSlider.y + prevSlider.height);
  textAlign(CENTER, CENTER);
  text(`Population: ${population}`, popSlider.x + popSlider.width / 2, popSlider.y - 10);




  var xsize = 100
  var ysize = 30

  var arr = []


  arr[0] = `TP = ${nf(TP, null, 1)}`
  arr[1] = `FP = ${nf(FP, null, 1)}`
  arr[2] = `FN = ${nf(FN, null, 1)}`
  arr[3] = `TN = ${nf(TN, null, 1)}`

  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 2; x++) {
      noStroke();
      let xpos = x * xsize + width - (xsize * 3);
      let ypos = y * ysize + height - (ysize * 2.3);

      let index = y * 2 + x; // find the index
      fill(222);
      if (inside(xpos, ypos, xsize, ysize)) {
        // were inside
        highlight = index;
        fill(52, 152, 219, 100);
      }

      //stroke(0);
      rect(xpos, ypos, xsize, ysize);
      fill(0)
      textAlign(CENTER, CENTER);
      text(arr[index], xpos, ypos - ysize, 100, 100);
      textAlign(LEFT, BOTTOM);


    }
  }

  textAlign(CENTER, CENTER);
  text('Reality', xsize / 2 + width - (xsize * 3), height - (ysize * 2.3) - 2.3 * ysize, 100, 100);
  text(`+`, width - (xsize * 3), height - (ysize * 2.3) - 2 * ysize, 100, 100);
  text(`-`, xsize + width - (xsize * 3), height - (ysize * 2.3) - 2 * ysize, 100, 100);
  push();
  translate(width - (xsize * 3) - .2 * xsize, height - (ysize * 2.3) + ysize)
  rotate(radians(270));
  text('Test', 0, 0);
  pop();

  text(`+`, width - (xsize * 3) - xsize*1.1 / 2, height - (ysize * 2.3) - ysize, 100, 100);
  text(`-`, width - (xsize * 3) - xsize*1.1 / 2, height - (ysize * 2.3), 100, 100);

  ACC = round(((TP + TN) / population) * 100)
  text(`ACC = ${ACC}%`, 2 * xsize + width - (xsize * 3), height - (ysize * 2.3) - 2 * ysize, 100, 100);
  PPV = round((TP / (TP + FP)) * 100)
  text(`PPV = ${PPV}%`, 2 * xsize + width - (xsize * 3), height - (ysize * 2.3) - ysize, 100, 100);
  NPV = round((TN / (FN + TN)) * 100)
  text(`NPV = ${NPV}%`, 2 * xsize + width - (xsize * 3), height - (ysize * 2.3), 100, 100);
  textAlign(LEFT, BOTTOM);
  stroke(0);
  line(xsize + width - (xsize * 3), height - (ysize * 2.3), xsize + width - (xsize * 3), height - (ysize * 2.3) + ysize * 2);
  line(width - (xsize * 3), ysize + height - (ysize * 2.3), 2 * xsize + width - (xsize * 3), ysize + height - (ysize * 2.3));

}


function inside(x, y, w, h) {
  if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
    return true;
  } else {
    return false;
  }
}

// constructor function is the same.
// it's a blueprint for creating many balls.
function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.diseased = false
  this.test_result = false
  this.sz = r;
  this.xspeed = random(-0.2, 0.2);
  this.yspeed = random(-0.2, 0.2);

  this.update = function() {
    this.x += this.xspeed;
    this.y += this.yspeed;
  };

  this.display = function() {
    if (this.diseased) {
      fill(192, 57, 43);
    } else {
      fill(46, 204, 113);
    }
    stroke(0);
    ellipse(this.x, this.y, this.sz, this.sz);
    fill(0);
    if (this.test_result) {
      text('+', this.x + this.sz / 2, this.y - this.sz / 2)
    } else {
      text('-', this.x + this.sz / 2, this.y - this.sz / 2)
    }
    if (this.res == highlight) {
      noFill();
      stroke(0);
      ellipse(this.x, this.y, this.sz * 4, this.sz * 4);
      fill(0);
    }

  };

  this.bounce = function() {
    if (this.x > width || this.x < 0) {
      this.xspeed *= -1;
    }
    if (this.y > height - bottom || this.y < 0) {
      this.yspeed *= -1;
    }
  }
}