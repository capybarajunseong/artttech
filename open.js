let marblePositions = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  background(210, 195, 160);
  drawMarbles();
}

function drawMarbles() {
  let marbleSize = 55;
  let numMarbles = 100;
  marblePositions = [];
  let outline = [];
  let step = marbleSize * 0.8;

  for (let x = width * 0.1; x <= width * 0.9; x += step) {
    let nx = map(x, width * 0.1, width * 0.9, 0, 5);
    let y = height - 100 - noise(nx) * 400;
    outline.push({x, y});
  }

  for (let i = 0; i < numMarbles; i++) {
    let placed = false;
    let tries = 0;
    while (!placed && tries < 100) {
      tries++;
      let idx = floor(random(outline.length));
      let base = outline[idx];
      let x = base.x + random(-step/2, step/2);
      let y = base.y + random(0, marbleSize * 2);

      if (y > height - 100 - marbleSize * 0.5) y = height - 100 - marbleSize * 0.5;

      let overlapping = false;
      for (let pos of marblePositions) {
        if (dist(x, y, pos.x, pos.y) < marbleSize * 1.1) {
          overlapping = true;
          break;
        }
      }
      if (!overlapping) {
        marblePositions.push({x, y, r: marbleSize});
        placed = true;
      }
    }
  }

  marblePositions.sort((a, b) => a.y - b.y);
  for (let pos of marblePositions) {
    drawMarble(pos.x, pos.y, marbleSize);
  }
}

function drawMarble(x, y, r) {
  push();
  translate(x, y);
  let gradient = drawingContext.createRadialGradient(0, 0, 0, 0, 0, r);
  gradient.addColorStop(0, 'rgba(200, 200, 200, 1)');
  gradient.addColorStop(0.5, 'rgba(150, 150, 150, 1)');
  gradient.addColorStop(1, 'rgba(100, 100, 100, 1)');
  drawingContext.fillStyle = gradient;
  noStroke();
  ellipse(0, 0, r * 2);
  fill(255, 255, 255, 50);
  ellipse(-r/3, -r/3, r/2);
  pop();
}

function mousePressed() {
  for (let pos of marblePositions) {
    if (dist(mouseX, mouseY, pos.x, pos.y) < pos.r / 2) {
      window.location.replace('touch.html');
      break;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}